import { TrainingDto } from 'src/training/dtos'
import { Training } from 'src/training/training.entity'
import { transformGym } from './gym.transform'
import { transformPublicUser } from './user.transform'
import { checkCanVisit } from '../check-can-visit.util'
import { User } from '../../user/user.entity'

export const transformTraining = (training: Training): TrainingDto => {
  const {
    id,
    title,
    description,
    trainers,
    gym,
    trainingDateTime,
    // trainingTime,
    learners,
  } = training

  return {
    id,
    title,
    description,
    trainers: trainers && trainers.map((t) => transformPublicUser(t)),
    learners: learners && learners.map((l) => transformPublicUser(l)),
    gym: transformGym(gym),
    trainingDateTime,
    // trainingTime,
  }
}

export const transformTrainingCheckVisit = (
  training: Training,
  learner: User,
): TrainingDto => {
  const { id, title, description, trainers, gym, trainingDateTime, learners } =
    training

  return {
    id,
    title,
    description,
    trainers: trainers && trainers.map((t) => transformPublicUser(t)),
    learners: learners && learners.map((l) => transformPublicUser(l)),
    gym: transformGym(gym),
    trainingDateTime,
    canBeVisited: checkCanVisit(trainingDateTime, learner, training),
    // trainingTime,
  }
}
