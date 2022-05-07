import { Expose, Transform } from 'class-transformer'
import { Id } from 'src/common/types'
import { Organization } from 'src/organization/organization.entity'

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
  organizations: Organization[]
}
