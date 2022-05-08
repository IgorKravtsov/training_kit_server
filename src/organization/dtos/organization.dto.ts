import { Expose } from 'class-transformer'
import { Id } from 'src/common/types'

export class OrganizationDto {
  @Expose()
  id: Id

  @Expose()
  title: string

  @Expose()
  logo?: string
}
