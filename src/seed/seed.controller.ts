import {
  BadRequestException,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AbonementService } from 'src/abonement/abonement.service'
import { CreateAbonementDto } from 'src/abonement/dtos/create-abonement.dto'
import { CharacteristicService } from 'src/characteristic/characteristic.service'
import { CreateCharDto } from 'src/characteristic/dtos'
import { CharacteristicType } from 'src/characteristic/enums'
import { SALT_NUMBER } from 'src/common/constants'
import { nowId } from 'src/common/types'
import { CreateGymDto } from 'src/gym/dtos'
import { GymService } from 'src/gym/gym.service'
import { CreateOrganizationDto } from 'src/organization/dtos'
import { OrganizationService } from 'src/organization/organization.service'
import { CreateTrainingDto } from 'src/training/dtos'
import { TrainingService } from 'src/training/training.service'
import { UserRoles } from 'src/user/enums'
import { UserService } from 'src/user/user.service'
import { AssignAbonementDto } from '../abonement/dtos'
import { LearnerAbonementService } from '../abonement/learner-abonement.service'

@Controller('seed')
export class SeedController {
  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private gymService: GymService,
    private characteristicService: CharacteristicService,
    private trainingService: TrainingService,
    private abonementService: AbonementService,
    private learnerAbonementService: LearnerAbonementService,
  ) {}

  @Post('organizations')
  async seedOrganizations() {
    const seedOrganizations: CreateOrganizationDto[] = [
      {
        title: 'Karate Kyokushinkay',
      },
    ]

    for (const o of seedOrganizations) {
      await this.organizationService.create(o)
    }

    return 'Organizations seeded successfully'
  }

  @Post('gyms')
  async seedGyms() {
    const seedGyms: CreateGymDto[] = [
      {
        title: 'Ден-Макс (Покровск)',
        address: 'ул. Пушкина, 12',
        trainers: [2, 3],
      },
      {
        title: 'Сокол (Кропивницкий)',
        address: 'ул. Соколова, 15',
        trainers: [2],
      },
      {
        title: 'Сокол-2 (Кропивницкий)',
        address: 'ул. Соколова, 15А',
        trainers: [2, 3],
      },
    ]

    for (const g of seedGyms) {
      const { trainers: trainerIds, ...data } = g
      const { entities: trainers, isRangeCorrect } =
        await this.userService.findInRangeId(trainerIds, {}, [
          UserRoles.TRAINER,
          UserRoles.ADMIN,
        ])
      if (!isRangeCorrect) {
        throw new BadRequestException('Заданы не верные id тренеров')
      }
      await this.gymService.create({
        ...data,
        trainers,
      })
    }

    return 'Gyms seeded successfully'
  }

  @Post('users')
  async seedUsers() {
    const seedUsers = [
      {
        name: 'learner',
        lastName: 'learner',
        email: 'l@l.com',
        password: '123',
        organizations: [1],
        role: UserRoles.LEARNER,
      },
      {
        name: 'trainer',
        lastName: 'trainer',
        email: 't@t.com',
        password: '123',
        organizations: [1],
        role: UserRoles.TRAINER,
      },
      {
        name: 'admin',
        lastName: 'admin',
        email: 'a@a.com',
        password: '123',
        organizations: [1],
        role: UserRoles.ADMIN,
      },
    ]

    for (const u of seedUsers) {
      const { password, organizations: organizationIds, ...data } = u
      const hashedPass = await bcrypt.hash(password, SALT_NUMBER)
      const newUser = await this.userService.create({
        ...data,
        password: hashedPass,
        organizations: organizationIds.map((id) => ({ id })),
      })
      await this.userService.create(newUser)
    }

    return 'Users seeded successfully'
  }

  @Post('characteristics')
  async seedCharacteristics() {
    const seedCharacteristics: CreateCharDto[] = [
      {
        title: 'Сила',
        type: CharacteristicType.Power,
        userId: 1,
      },
      {
        title: 'Выносливость',
        type: CharacteristicType.Endurance,
        userId: 1,
      },
      {
        title: 'Скорость',
        type: CharacteristicType.Speed,
        userId: 1,
      },
    ]

    for (const c of seedCharacteristics) {
      const { userId, ...data } = c
      const user = await this.userService.findOne({ id: userId } as any)
      if (!user) {
        throw new BadRequestException(
          `[seedCharacteristics] Не найден пользователь с id: ${userId}`,
        )
      }
      await this.characteristicService.create({
        ...data,
        user,
      })
    }

    return 'Characteristics seeded successfully'
  }

  @Post('trainings')
  async seedTrainings() {
    const seedTrainings: CreateTrainingDto[] = [
      {
        title: 'Ката (старшая группа)',
        description: 'Ката. Много ката',
        trainingDate: new Date('2021-03-15 15:00:00'),
        trainingTime: new Date('2021-03-15 15:00:00'),
        gymId: 1,
        trainers: [2, 3],
      },
      {
        title: 'Кумите (младшая группа)',
        description: 'Кумите. Не забудьте защиту на руки и ноги',
        trainingDate: new Date('2021-03-15 15:00:00'),
        trainingTime: new Date('2021-03-15 15:00:00'),
        gymId: 1,
        trainers: [2],
      },
      {
        title: 'Кумите (средняя группа)',
        description: 'Кумите. Не забудьте защиту на руки и ноги',
        trainingDate: new Date('2021-03-15 15:00:00'),
        trainingTime: new Date('2021-03-15 15:00:00'),
        gymId: 1,
        trainers: [3],
      },
    ]

    for (const t of seedTrainings) {
      const { gymId, trainers: trainerIds, ...data } = t

      const gym = await this.gymService.findOne({ id: gymId as nowId })
      if (!gym) {
        throw new NotFoundException(
          `[seedTrainings] Не найден зал с id: '${gymId}'`,
        )
      }

      const { entities: trainers, isRangeCorrect } =
        await this.userService.findInRangeId(trainerIds, {}, [
          UserRoles.TRAINER,
          UserRoles.ADMIN,
        ])
      if (!isRangeCorrect) {
        throw new NotFoundException(
          `[seedTrainings] Заданы неверные id тренера(-ов)`,
        )
      }

      const newTraining = await this.trainingService.create({
        ...data,
        gym,
        trainers,
      })
      await this.trainingService.create(newTraining)
    }

    return 'Trainings seeded successfully'
  }

  @Post('abonements')
  async seedAbonements() {
    const seedAbonements: CreateAbonementDto[] = [
      {
        title: 'Месячный стандарт (Покровск)',
        price: 100,
        amountDays: 20,
        amountTrainings: 20,
        creator: 2,
        gym: 1,
      },
      {
        title: 'Недельный стандарт (Покровск)',
        price: 40,
        amountDays: 7,
        amountTrainings: 3,
        creator: 3,
        gym: 1,
      },
      {
        title: 'Месячный премиум (Кропивницкий)',
        price: 150,
        amountDays: 30,
        // amountTrainings: 0,
        creator: 2,
        gym: 2,
      },
    ]

    for (const a of seedAbonements) {
      const { creator: creatorId, gym: gymId, ...data } = a

      const gym = await this.gymService.findOne({ id: gymId as nowId })
      if (!gym) {
        throw new NotFoundException(
          `[seedAbonements] Не найден зал с id: '${gymId}'`,
        )
      }

      const creator = await this.userService.findOne({ id: creatorId as nowId })
      if (!gym) {
        throw new NotFoundException(
          `[seedAbonements] Не найден зал с id: '${creatorId}'`,
        )
      }

      await this.abonementService.create({
        ...data,
        gym,
        creator,
      })
    }

    return 'Abonements seeded successfully'
  }

  @Post('learner-abonements')
  async seedLearnerAbonements() {
    const seedLearnerAbonements: AssignAbonementDto[] = [
      {
        learner: 1,
        abonement: 1,
      },
    ]

    for (const la of seedLearnerAbonements) {
      const { learner: learnerId, abonement: abonementId } = la

      const abonement = await this.abonementService.findOne({
        id: abonementId as nowId,
      })
      if (!abonement) {
        throw new BadRequestException(
          `[seedLearnerAbonements] Не найден абонемент с id: ${abonementId}`,
        )
      }

      const learner = await this.userService.findOne({ id: learnerId as nowId })
      if (!learner) {
        throw new BadRequestException(
          `[seedLearnerAbonements] Не найден пользователь с id: ${abonementId}`,
        )
      }

      let endDate: Date | null = null
      if (abonement.amountDays !== null) {
        const date = new Date()
        date.setDate(date.getDate() + abonement.amountDays)
        endDate = date
      }
      await this.learnerAbonementService.create({
        trainingsLeft: abonement.amountTrainings,
        daysLeft: abonement.amountDays,
        endDate,
        learner,
        abonement,
      })
    }
    return 'Learner-abonements seeded successfully'
  }

  @Post('all')
  async seedAll() {
    const orgMessage = await this.seedOrganizations()
    const usersMessage = await this.seedUsers()
    const gymsMessage = await this.seedGyms()
    const charsMessage = await this.seedCharacteristics()
    const trainingsMessage = await this.seedTrainings()
    const abonementsMessage = await this.seedAbonements()
    const learnerAbonementsMessage = await this.seedLearnerAbonements()

    return `===============================================
    ${orgMessage}
    ${usersMessage}
    ${gymsMessage}
    ${charsMessage}
    ${trainingsMessage}
    ${abonementsMessage}
    ${learnerAbonementsMessage}
    ===============================================`
  }
}
