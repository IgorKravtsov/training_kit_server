import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { Between, In } from 'typeorm'
import { Id, nowId } from 'src/common/types'
import { GymService } from 'src/gym/gym.service'
import { UserRoles } from 'src/user/enums'
import { UserService } from 'src/user/user.service'
import { transformPublicUser, transformTraining } from 'src/utils/transform'
import { CreateTrainingDto, GetTrainingLearners, TrainingDto } from './dtos'
import { TrainingService } from './training.service'
import {
  GetLearnerTrainingHistoryResponse,
  GetLernerTrainingHistoryRequest,
  GetUserTrainingsRequest,
} from './types'
import {
  GYM_RELATION,
  LEARNERS_RELATION,
  TRAINERS_RELATION,
} from 'src/common/constants'
import { MarkVisitingTrainingRequest } from './types/mark-visiting-training.type'
import { User } from '../user/user.entity'
import { checkCanVisitDateTime } from 'src/utils/check-can-visit.util'
import { PublicUserDto } from 'src/user/dtos'

@Controller('training')
export class TrainingController {
  constructor(
    private trainingService: TrainingService,
    private userService: UserService,
    private gymService: GymService,
  ) {}

  @Get('all')
  // @UseGuards(AdminGuard)
  async getAllTrainings() {
    return await this.trainingService.all([
      LEARNERS_RELATION,
      TRAINERS_RELATION,
    ])
  }

  @Post('create')
  // @UseGuards(TrainerGuard)
  async create(@Body() body: CreateTrainingDto): Promise<TrainingDto> {
    const { gymId, trainers: trainerIds, learners: learnerIds, ...data } = body

    const gym = await this.gymService.findOne({ id: gymId as nowId })
    if (!gym) {
      throw new NotFoundException(`Не найден зал с id: '${gymId}'`)
    }

    const { entities: trainers, isRangeCorrect: isTrainersRangeCorrect } =
      await this.userService.findInRangeId(trainerIds, {}, [
        UserRoles.TRAINER,
        UserRoles.ADMIN,
      ])
    if (!isTrainersRangeCorrect) {
      throw new NotFoundException(`Заданы неверные id тренера(-ов)`)
    }

    const learnersData = learnerIds
      ? await this.userService.findInRangeId(learnerIds)
      : undefined

    if (learnerIds && !learnersData?.isRangeCorrect) {
      throw new NotFoundException(`Заданы неверные id учеников`)
    }

    const newTraining = await this.trainingService.create({
      ...data,
      gym,
      trainers,
      learners: learnersData?.entities,
    })

    return transformTraining(newTraining)
  }

  @Delete('delete/:trainingId')
  async delete(@Param('trainingId') trainingId: Id) {
    return await this.trainingService.delete(trainingId)
  }

  @Post('get-learner-training-history')
  async getLearnerTrainingHistory(
    @Body() body: GetLernerTrainingHistoryRequest,
  ): Promise<GetLearnerTrainingHistoryResponse> {
    const { learnerId, days = -1 } = body
    const neededDate = new Date()
    neededDate.setDate(new Date().getDate() - days - 1)

    const trainings = await this.trainingService.findMany(
      {
        learners: [{ id: learnerId as nowId }],
        trainingDateTime:
          days !== -1 ? Between(neededDate, new Date()) : undefined,
      },
      [TRAINERS_RELATION, LEARNERS_RELATION, GYM_RELATION],
      { trainingDateTime: 'DESC' },
    )

    return {
      count: trainings.length,
      trainings: trainings.map((t) => transformTraining(t)),
    }
  }

  @Post('get-user-trainings')
  async getUserTrainings(@Body() body: GetUserTrainingsRequest) {
    const { learnerId, startDate, endDate } = body

    if (startDate > endDate) {
      throw new BadRequestException(`Задан неверный диапазон дат`)
    }

    const learner = await this.userService.findOne({ id: learnerId as nowId }, [
      TRAINERS_RELATION,
    ])
    if (!learner) {
      throw new NotFoundException(`Ученик с id: ${learnerId} не найден`)
    }

    const trainings = await this.trainingService.findMany(
      {
        trainingDateTime: Between(startDate, endDate),
      },
      [TRAINERS_RELATION, LEARNERS_RELATION, GYM_RELATION],
    )

    const gymTrainings = this.trainingService.convertGymTraining(
      trainings,
      learner.trainers.map((t) => t.id),
      learner,
    )

    return {
      totalCount: gymTrainings.length,
      trainings: gymTrainings,
    }
  }

  @Post('get-training-learners')
  async getTrainerLearners(
    @Body() body: GetTrainingLearners,
  ): Promise<PublicUserDto[]> {
    const { trainingId } = body

    const training = await this.trainingService.findOne(
      {
        id: trainingId as nowId,
      },
      [LEARNERS_RELATION],
    )
    if (!training) {
      throw new BadRequestException(`Не найден тренер с id: ${trainingId}`)
    }

    // const learners = await this.trainingService.getTrainingLearners(trainingId)

    return training.learners.map(transformPublicUser)
  }

  @Post('mark-visiting-training')
  async markVisitingTraining(@Body() body: MarkVisitingTrainingRequest) {
    const { trainingId, userId } = body

    const training = await this.trainingService.findOne(
      {
        id: trainingId as nowId,
      },
      [LEARNERS_RELATION],
    )
    if (!training) {
      throw new NotFoundException(`Не найдена тренеровка с id: ${trainingId}`)
    }

    const learner = await this.userService.findOne({ id: userId as nowId })
    if (!learner) {
      throw new NotFoundException(`Не найден пользователь с id: ${userId}`)
    }

    if (
      training?.learners?.filter(
        (trainingLearner) => trainingLearner.id === learner.id,
      ).length > 0
    ) {
      return {
        message: `Пользователь с id: ${userId} уже записан на тренеровку с id: ${trainingId}`,
      }
    }

    if (!checkCanVisitDateTime(training.trainingDateTime)) {
      throw new BadRequestException(
        `Нельзя записаться на тренеровку с id: ${trainingId}. Неподходящее время`,
      )
    }

    let trainingLearners: User[] = []

    if (training.learners) {
      trainingLearners = training.learners
      trainingLearners.push(learner)
    } else {
      trainingLearners = [learner]
    }

    await this.trainingService.create({
      ...training,
      learners: trainingLearners,
    })

    return {
      message: `Пользователь с id: ${userId} успешно записан на тренеровку ${trainingId}`,
    }
  }

  @Post('get-trainer-trainings')
  async getTrainerTrainings(
    @Body() body: { trainerId: Id },
  ): Promise<TrainingDto[]> {
    const { trainerId } = body

    const trainer = await this.userService.findOne({
      id: trainerId as nowId,
    })
    if (!trainer) {
      throw new BadRequestException(`Не найден тренер с id: ${trainerId}`)
    }

    const trainings = await this.trainingService.findMany(
      {
        trainers: { id: trainerId as nowId },
      },
      [GYM_RELATION],
    )
    // let trainings = await this.userService.getTrainerTrainings(trainerId)
    // trainings = this.userService.deleteDuplicates(trainings)

    return trainings.map(transformTraining)
  }
}
