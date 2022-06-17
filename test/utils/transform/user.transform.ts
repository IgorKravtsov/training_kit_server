import { UserDto } from 'src/user/dtos'
import { PublicUserDto } from 'src/user/dtos/public-user.dto'
import { User } from 'src/user/user.entity'
import { transformOrganization } from './organization.transform'
import { transformGym } from './gym.transform'
import { transformAbonement } from './abonement.transform'
import { transformLearnerAbonement } from './learner-abonement.transform'
import { transformCharacteristic } from './characteristic.transform'

export const transformUser = (user: User): UserDto => {
  const {
    name,
    lastName,
    email,
    id,
    organizations,
    role,
    trainers,
    selectedOrganization,
    gyms,
    characteristics,
    level,
    lang,
    abonements,
    learnerAbonements,
  } = user

  return {
    id,
    displayName: `${name} ${lastName}`,
    email,
    organizations: organizations.map((o) => transformOrganization(o)),
    trainers: trainers && trainers.map((t) => transformPublicUser(t)),
    role,
    selectedOrganization:
      selectedOrganization && transformOrganization(selectedOrganization),
    gyms: gyms && gyms.map((g) => transformGym(g)),
    characteristics:
      characteristics && characteristics.map((c) => transformCharacteristic(c)),
    level,
    lang,
    abonements: abonements && abonements.map((a) => transformAbonement(a)),
    learnerAbonements:
      learnerAbonements &&
      learnerAbonements.map((la) => transformLearnerAbonement(la)),
  }
}

export const transformPublicUser = (user: User): PublicUserDto => {
  return {
    displayName: `${user.name} ${user.lastName}`,
    email: user.email,
    id: user.id,
  }
}
