import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { Between } from 'typeorm'
import { Id, nowId } from 'src/common/types'
import { GymService } from 'src/gym/gym.service'
import { UserRoles } from 'src/user/enums'
import { UserService } from 'src/user/user.service'
import { transformTraining } from 'src/utils/transform'
import { CreateTrainingDto, TrainingDto } from './dtos'
import { TrainingService } from './training.service'
import {
  GetLearnerTrainingHistoryResponse,
  GetLernerTrainingHistoryRequest,
} from './types'
import {
  GYM_RELATION,
  LEARNERS_RELATION,
  TRAINERS_RELATION,
} from 'src/common/constants'

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

    const { entities: learners, isRangeCorrect: isLearnersRangeCorrect } =
      await this.userService.findInRangeId(learnerIds)
    if (!isLearnersRangeCorrect) {
      throw new NotFoundException(`Заданы неверные id учеников`)
    }

    const newTraining = await this.trainingService.create({
      ...data,
      gym,
      trainers,
      learners,
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
    neededDate.setDate(new Date().getDate() - days)

    const trainings = await this.trainingService.findMany(
      {
        learners: [{ id: learnerId as nowId }],
        trainingDate: days !== -1 ? Between(neededDate, new Date()) : undefined,
      },
      [TRAINERS_RELATION, LEARNERS_RELATION, GYM_RELATION],
    )

    return {
      count: trainings.length,
      trainings: trainings.map((t) => transformTraining(t)),
    }
  }
}
