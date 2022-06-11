import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { nowId } from 'src/common/types'
import { TrainerGuard } from 'src/user/guards'
import {
  transformAbonement,
  transformLearnerAbonement,
} from 'src/utils/transform'
import { UserService } from 'src/user/user.service'
import { GymService } from 'src/gym/gym.service'
import { AbonementService } from './abonement.service'
import { LearnerAbonementService } from './learner-abonement.service'
import {
  AbonementDto,
  AssignAbonementDto,
  CreateAbonementDto,
  LearnerAbonementDto,
} from './dtos'
import { ABONEMENT_RELATION, LEARNER_RELATION } from 'src/common/constants'
import {
  GetLearnerAbonementsRequest,
  GetOneLearnerAbonementRequest,
  GetTrainersAbonementsRequest,
} from './types'
import { UserRoles } from 'src/user/enums'

@Controller('abonement')
export class AbonementController {
  constructor(
    private userService: UserService,
    private gymService: GymService,
    private abonementService: AbonementService,
    private learnerAbonementService: LearnerAbonementService,
  ) {}

  @Get('all')
  async getAllLearnerAbonementsFromDB() {
    return await this.learnerAbonementService.all([
      LEARNER_RELATION,
      ABONEMENT_RELATION,
    ])
  }

  @Post('get-learner-abonements')
  // @UseGuards(UseGuards)
  async getLearnerAbonements(
    @Body() body: GetLearnerAbonementsRequest,
  ): Promise<LearnerAbonementDto[]> {
    const { learnerId } = body

    const learner = await this.userService.findOne({ id: learnerId as nowId })
    if (!learner) {
      throw new NotFoundException(`Не найден ученик с id: ${learnerId}`)
    }

    const learnerAbonements = await this.learnerAbonementService.findMany(
      {
        learner: { id: learnerId as nowId },
      },
      [ABONEMENT_RELATION],
    )

    return learnerAbonements.map(transformLearnerAbonement)
  }

  @Post('get-one-learner-abonement')
  // @UseGuards(UseGuards)
  async getLearnerAbonement(
    @Body() body: GetOneLearnerAbonementRequest,
  ): Promise<LearnerAbonementDto> {
    const { abonementId, learnerId } = body

    const learner = await this.userService.findOne({ id: learnerId as nowId })
    if (!learner) {
      throw new BadRequestException(`Не найден ученик с id: ${learnerId}`)
    }

    const abonement = await this.abonementService.findOne({
      id: abonementId as nowId,
    })
    if (!abonement) {
      throw new BadRequestException(`Не найден абонемент с id: ${abonementId}`)
    }

    const learnerAbonement = await this.learnerAbonementService.findOne(
      {
        abonement: { id: abonementId as nowId },
        learner: { id: learnerId as nowId },
      },
      [ABONEMENT_RELATION],
    )
    if (!learnerAbonement) {
      throw new NotFoundException(
        `Не найден абонемент с id: ${abonementId} для ученика с id: ${learnerId}`,
      )
    }

    return transformLearnerAbonement(learnerAbonement)
  }

  @Post('get-trainers-abonements')
  // @UseGuards(UseGuards)
  async getTrainersAbonements(
    @Body() body: GetTrainersAbonementsRequest,
  ): Promise<AbonementDto[]> {
    const { trainers } = body

    const { isRangeCorrect } = await this.userService.findInRangeId(
      trainers,
      {},
      [UserRoles.ADMIN, UserRoles.TRAINER],
    )
    if (!isRangeCorrect) {
      throw new BadRequestException(
        `Не верно задан диапазон id тренеров (${trainers})`,
      )
    }

    const abonements = await this.abonementService.getTrainerAbonements(
      trainers,
    )
    // const learner = await this.userService.findOne({ id: learnerId as nowId })
    // if (!learner) {
    //   throw new BadRequestException(`Не найден ученик с id: ${learnerId}`)
    // }

    // const abonement = await this.abonementService.findOne({
    //   id: abonementId as nowId,
    // })
    // if (!abonement) {
    //   throw new BadRequestException(`Не найден абонемент с id: ${abonementId}`)
    // }

    // const learnerAbonement = await this.learnerAbonementService.findOne({
    //   abonement: { id: abonementId as nowId },
    //   learner: { id: learnerId as nowId },
    // })
    // if (!learnerAbonement) {
    //   throw new NotFoundException(
    //     `Не найден абонемент с id: ${abonementId} для ученика с id: ${learnerId}`,
    //   )
    // }

    return abonements.map(transformAbonement)
  }

  @Post('create')
  @UseGuards(TrainerGuard)
  async create(@Body() body: CreateAbonementDto): Promise<AbonementDto> {
    const { creatorId: userId, gymId: gymId, ...data } = body

    const creator = await this.userService.findOne({ id: userId as nowId })
    if (!creator) {
      throw new BadRequestException(`Не найден пользователь с id: '${userId}'`)
    }

    const gym = await this.gymService.findOne({ id: gymId as nowId })
    if (!gym) {
      throw new BadRequestException(`Не найден зал с id: '${gymId}'`)
    }

    const newAbonement = await this.abonementService.create({
      ...data,
      creator,
      gym,
    })

    return transformAbonement(newAbonement)
  }

  @Post('assign-abonement')
  async assignAbonement(
    @Body() body: AssignAbonementDto,
  ): Promise<Omit<LearnerAbonementDto, 'learner' | 'abonement'>> {
    const { abonement: abonementId, learner: learnerId } = body

    const abonement = await this.abonementService.findOne({
      id: abonementId as nowId,
    })
    if (!abonement) {
      throw new BadRequestException(`Не найден абонемент с id: ${abonementId}`)
    }

    const learner = await this.userService.findOne({ id: learnerId as nowId })
    if (!learner) {
      throw new BadRequestException(`Не найден пользователь с id: ${learnerId}`)
    }

    const learnerAssigned = await this.learnerAbonementService.findOne({
      learner: { id: learnerId as nowId },
    })
    if (learnerAssigned) {
      throw new BadRequestException(
        `Пользователь уже с id: ${learnerId} уже подписан на абонемент ${abonement.title} (id: ${abonement.id})`,
      )
    }

    let endDate: Date | null = null
    if (abonement.amountDays !== null) {
      const date = new Date()
      date.setDate(date.getDate() + abonement.amountDays)
      endDate = date
    }
    const newAssignedAbonement = await this.learnerAbonementService.create({
      learner,
      abonement,
      trainingsLeft: abonement.amountTrainings,
      daysLeft: abonement.amountDays,
      endDate,
    })

    return transformLearnerAbonement(newAssignedAbonement)
  }
}
