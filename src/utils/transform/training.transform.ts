import { TrainingDto } from 'src/training/dtos'
import { Training } from 'src/training/training.entity'
import { transformGym } from './gym.transform'
import { transformPublicUser } from './user.transform'

export const transformTraining = (training: Training): TrainingDto => {
  const { id, title, description, trainers, gym, trainingDate, trainingTime } =
    training
  return {
    id,
    title,
    description,
    trainers: trainers.map((user) => transformPublicUser(user)),
    gym: transformGym(gym),
    trainingDate,
    trainingTime,
  }
}
