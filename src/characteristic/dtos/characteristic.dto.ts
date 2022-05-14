import { Expose } from 'class-transformer'
import { PublicUserDto } from 'src/user/dtos'
import { CharacteristicType } from '../enums'
import { Id } from 'src/common/types'

export class CharacteristicDto {
  @Expose()
  id: Id

  @Expose()
  title: string

  @Expose()
  type: CharacteristicType

  @Expose()
  user: PublicUserDto
}