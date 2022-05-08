import { Expose } from 'class-transformer'
import { Id } from 'src/common/types'

export class GymDto {
  @Expose()
  id: Id

  @Expose()
  title: string

  @Expose()
  address: string
}
