import { Expose, Transform } from 'class-transformer'
import { Id } from 'src/common/types'
import { OrganizationDto } from 'src/organization/dtos'
import { UserRoles } from '../enums'
import { PublicUserDto } from './public-user.dto'

export class UserDto {
  @Expose()
  id: Id

  @Expose()
  email: string

  @Transform(({ obj }) => `${obj.name} ${obj.lastName}`)
  @Expose()
  displayName: string

  @Transform(({ obj }) => obj.organizations)
  @Expose()
  organizations: OrganizationDto[]

  @Expose()
  trainers?: PublicUserDto[]

  @Expose()
  role: UserRoles
}
