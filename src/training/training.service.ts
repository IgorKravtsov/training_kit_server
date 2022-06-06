import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Id } from 'src/common/types'
import { isArrContainsObj } from 'src/utils'
import { transformGym, transformTrainingCheckVisit } from 'src/utils/transform'
import { Training } from './training.entity'
import { GymTraining } from './types'
import { User } from '../user/user.entity'
import { TrainingDto } from './dtos'

@Injectable()
export class TrainingService extends AbstractService<Training> {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
  ) {
    super(trainingRepository)
  }

  byDateTime = (t1: TrainingDto, t2: TrainingDto) => {
    if (t1.trainingDateTime > t2.trainingDateTime) {
      return 1
    }
    if (t1.trainingDateTime < t2.trainingDateTime) {
      return -1
    }
    // a должно быть равным b
    return 0
  }

  convertGymTraining(
    trainings: Training[],
    trainerIds: Id[],
    learner?: User,
  ): GymTraining[] {
    const tmpTrainings: Training[] = []
    for (let i = 0; i < trainings.length; i++) {
      const nowTraining = trainings[i]
      if (
        nowTraining.trainers.filter((trainer) =>
          trainerIds.includes(trainer.id),
        ).length > 0
      ) {
        tmpTrainings.push(nowTraining)
      }
    }

    const res: GymTraining[] = []

    for (let i = 0; i < tmpTrainings.length; i++) {
      const nowGym = tmpTrainings[i].gym
      if (!isArrContainsObj(res, nowGym, 'gym', 'id')) {
        const resTrainings = tmpTrainings.filter((t) => t.gym.id === nowGym.id)
        res.push({
          gym: transformGym(nowGym),
          trainings: resTrainings
            .map((rt) => transformTrainingCheckVisit(rt, learner))
            .sort(this.byDateTime),
        })
      }
    }
    return res
  }
}
