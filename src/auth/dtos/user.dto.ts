import { Expose, Transform } from 'class-transformer'
import { Id } from 'src/common/types'

export class UserDto {
  @Expose()
  id: Id

  @Expose()
  email: string

  @Transform(({ obj }) => `${obj.name} ${obj.lastName}`)
  @Expose()
  displayName: string
}
