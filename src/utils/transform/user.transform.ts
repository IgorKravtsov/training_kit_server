import { UserDto } from 'src/user/dtos'
import { PublicUserDto } from 'src/user/dtos/public-user.dto'
import { User } from 'src/user/user.entity'
import { transformOrganization } from './organization.transform'

export const transformUser = (user: User): UserDto => {
  const { name, lastName, email, id, organizations, role, trainers } = user
  return {
    id,
    displayName: `${name} ${lastName}`,
    email,
    organizations: organizations.map((o) => transformOrganization(o)),
    trainers: trainers && trainers.map((t) => transformPublicUser(t)),
    role,
  }
}

export const transformPublicUser = (user: User): PublicUserDto => {
  return {
    displayName: `${user.name} ${user.lastName}`,
    email: user.email,
    id: user.id,
  }
}
