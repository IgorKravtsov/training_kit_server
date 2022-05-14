import { Expose } from 'class-transformer'
import { PublicUserDto } from 'src/user/dtos'
import { CharacteristicType } from 'src/characteristic/enums'
import { Id } from 'src/common/types'
import { CharacteristicData } from 'src/characteristic/types'

export class CharacteristicDto {
  @Expose()
  id: Id

  @Expose()
  title: string

  @Expose()
  type: CharacteristicType

  @Expose()
  user?: PublicUserDto

  @Expose()
  data?: CharacteristicData
}
