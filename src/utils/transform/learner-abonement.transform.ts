import { LearnerAbonement } from 'src/abonement/learner-abonement.entity'
import { LearnerAbonementDto } from 'src/abonement/dtos/learner-abonement.dto'
import { transformPublicUser } from './user.transform'
import { transformAbonementOnly } from './abonement.transform'

export const transformLearnerAbonement = (
  la: LearnerAbonement,
): LearnerAbonementDto => {
  const { id, learner, abonement, daysLeft, trainingsLeft } = la
  return {
    id,
    learner: learner && transformPublicUser(learner),
    abonement: abonement && transformAbonementOnly(abonement),
    trainingsLeft,
    daysLeft,
  }
}
