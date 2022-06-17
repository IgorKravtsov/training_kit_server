import { User } from 'src/user/user.entity'
import { Training } from 'src/training/training.entity'
import {
  CannotVisitTraining,
  CannotVisitTrainingType,
} from 'src/training/types/cannot-visit-training.interface'

export const checkCanVisit = (
  trainingDate: Date | string,
  learner: User,
  training: Training,
): boolean | CannotVisitTraining => {
  if (!checkCanVisitDateTime(trainingDate)) {
    return {
      type: CannotVisitTrainingType.Time,
      canBeVisited: false,
    }
  } else if (checkIsMarkedAlready(training, learner)) {
    return {
      type: CannotVisitTrainingType.AlreadyMarked,
      canBeVisited: false,
    }
  }
  return true
}

const checkIsMarkedAlready = (training: Training, learner: User): boolean => {
  const foundLearner = training.learners.find((l) => l.id === learner.id)
  return !!foundLearner
}

export const checkCanVisitDateTime = (trainingDate: Date | string): boolean => {
  if (!trainingDate) return false

  const tDate = new Date(trainingDate)

  const THIRTY_MINUTES = 30
  const startVisitTime = new Date(tDate)
  const endVisitTime = new Date(tDate)

  startVisitTime.setMinutes(tDate.getMinutes() - THIRTY_MINUTES)
  endVisitTime.setMinutes(tDate.getMinutes() + THIRTY_MINUTES)

  const nowDate = new Date()

  return nowDate > startVisitTime && nowDate < endVisitTime
}
