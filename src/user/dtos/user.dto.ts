import { Expose, Transform } from 'class-transformer'
import { Id } from 'src/common/types'
import { OrganizationDto } from 'src/organization/dtos'
import { GymDto } from 'src/gym/dtos'
import { CharacteristicDto } from 'src/characteristic/dtos'
import { AbonementDto, LearnerAbonementDto } from 'src/abonement/dtos'
import { LanguageType, UserRoles } from '../enums'
import { PublicUserDto } from './public-user.dto'

export class UserDto {
  @Expose()
  id: Id

  @Expose()
  email: string

  // @Transform(({ obj }) => `${obj.name} ${obj.lastName}`)
  @Expose()
  displayName: string

  @Transform(({ obj }) => obj.organizations)
  @Expose()
  organizations: OrganizationDto[]

  @Expose()
  trainers?: PublicUserDto[]

  @Expose()
  role: UserRoles

  @Expose()
  selectedOrganization?: OrganizationDto

  @Expose()
  gyms?: GymDto[]

  @Expose()
  characteristics?: CharacteristicDto[]

  @Expose()
  abonements?: AbonementDto[]

  @Expose()
  learnerAbonements?: LearnerAbonementDto[]

  @Expose()
  level: string

  @Expose()
  lang: LanguageType
}
