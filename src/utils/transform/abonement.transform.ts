import { Abonement } from 'src/abonement/abonement.entity'
import { AbonementDto } from 'src/abonement/dtos/abonement.dto'
import { transformGym } from './gym.transform'
import { transformPublicUser } from './user.transform'

export const transformAbonement = (abonement: Abonement): AbonementDto => {
  const { id, title, price, amountDays, amountTrainings, creator, gym } =
    abonement
  return {
    id,
    title,
    price,
    amountDays,
    amountTrainings,
    creator: transformPublicUser(creator),
    gym: transformGym(gym),
  }
}
