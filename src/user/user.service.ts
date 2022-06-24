import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import {
  ABONEMENT_TABLE,
  CHARACTERISTIC_TABLE,
  GYM_TABLE,
  LEARNER_ABONEMENT_RELATION,
  ORGANIZATION_TABLE,
  TRAINERS_RELATION,
  TRAINER_LEARNER_TABLE,
  TRAINING_TABLE,
  TRAINING_TRAINER_TABLE,
  USER_TABLE,
} from 'src/common/constants'
import { PaginatedResult } from 'src/common/interfaces'
import { Id } from 'src/common/types'
import { Training } from 'src/training/training.entity'
import { FindOptionsOrder, In, Repository } from 'typeorm'
import { ChangeLangDto } from './dtos'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserRoles } from './enums'
import { User } from './user.entity'

// interface GymTraining extends Training {
//   address: string
//   img?: string
//   gymId: number
// }

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  // transformGymTraining(gymTraining: GymTraining): Training {
  //   return {
  //     ...gymTraining,
  //     gym: {
  //       id: gymTraining.gymId,
  //       address: gymTraining.address,
  //       img: gymTraining.img,
  //     },
  //   }
  // }

  deleteDuplicates<T extends { id: Id }>(arr: T[]): T[] {
    return arr.reduce((acc, n) => {
      const i = acc.findIndex((m) => m.id === n.id)
      if (!~i || !acc[i].checked) {
        acc.push(n)
        if (~i) {
          acc.splice(i, 1)
        }
      }
      return acc
    }, [])
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult<User>> {
    const { data, meta } = await super.paginate(page, relations)
    return {
      data: data.map((user) => {
        const { password, ...data } = user
        return data
      }),
      meta,
    }
  }

  async updateUser(id: Id, body: UpdateUserDto): Promise<User> {
    const { organizations, ...data } = body

    await super.update(id, {
      ...data,
      organizations: organizations?.map((id) => ({ id })),
    })
    return await this.userRepository.findOne({
      where: { id } as any,
      relations: [
        TRAINERS_RELATION,
        LEARNER_ABONEMENT_RELATION,
        ABONEMENT_TABLE,
        ORGANIZATION_TABLE,
        CHARACTERISTIC_TABLE,
        GYM_TABLE,
      ],
    })
  }

  async updateLang(id: Id, body: ChangeLangDto): Promise<User> {
    // const { organizations, ...data } = body

    await super.update(id, {
      lang: body.lang,
    })
    return await this.userRepository.findOne({
      where: { id } as any,
      relations: [
        TRAINERS_RELATION,
        LEARNER_ABONEMENT_RELATION,
        ABONEMENT_TABLE,
        ORGANIZATION_TABLE,
        CHARACTERISTIC_TABLE,
        GYM_TABLE,
      ],
    })
  }

  async findInRangeId(
    ids: Id[],
    orderBy?: FindOptionsOrder<User>,
    roles: UserRoles[] = [],
  ): Promise<{ entities: User[]; isRangeCorrect: boolean }> {
    const entities = await this.repository.find({
      where: { id: In(ids), role: roles.length > 0 ? In(roles) : undefined },
      order: orderBy,
    })
    return {
      entities,
      isRangeCorrect: entities.length >= ids.length,
    }
  }

  async findByNameLastNameOrEmail(search: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder(USER_TABLE)
      .where(
        'role=:trainer OR role=:admin AND (name LIKE :search OR lastName LIKE :search OR email LIKE :search)',
        {
          search: `%${search}%`,
          trainer: UserRoles.TRAINER,
          admin: UserRoles.ADMIN,
        },
      )
      .getMany()
  }

  async findLearnerByNameLastNameOrEmail(search: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder(USER_TABLE)
      .where(
        'role=:learner AND (name LIKE :search OR lastName LIKE :search OR email LIKE :search)',
        {
          search: `%${search}%`,
          learner: UserRoles.LEARNER,
        },
      )
      .getMany()
  }

  async getTrainerLearners(trainerId: Id): Promise<User[]> {
    const t = await this.repository.query(
      `SELECT * FROM users WHERE id IN 
      (SELECT learnerId FROM users u
      INNER JOIN trainer_learner tl ON u.id=tl.trainerId
      WHERE tl.trainerId=${trainerId})`,
    )
    // .createQueryBuilder(TRAINER_LEARNER_TABLE)
    // .where('trainerId=:trainerId', {
    //   trainerId,
    // })
    // .getMany()
    return t
  }

  async getTrainerTrainings(trainerId: Id): Promise<Training[]> {
    const t = await this.repository.query(
      `SELECT * FROM ${TRAINING_TABLE} ot 
      INNER JOIN ${GYM_TABLE} g ON g.id=ot.gymId
      WHERE ot.id IN 
      (SELECT trainingId FROM trainings t
      INNER JOIN ${TRAINING_TRAINER_TABLE} tt ON t.id=tt.trainingId
      WHERE tt.trainerId=${trainerId})`,
    )
    // .createQueryBuilder(TRAINER_LEARNER_TABLE)
    // .where('trainerId=:trainerId', {
    //   trainerId,
    // })
    // .getMany()
    return t
  }

  async addLeanersToTrainer(trainerId: Id, learnerIds: Id[]) {
    for (const learnerId of learnerIds) {
      await this.repository
        .query(`INSERT INTO ${TRAINER_LEARNER_TABLE} (trainerId, learnerId)
      VALUES (${trainerId}, ${learnerId})
      `)
    }
    return { message: 'ok' }
  }
}
