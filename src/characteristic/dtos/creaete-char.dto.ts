import { IsEnum, IsNotEmpty } from 'class-validator'
import { Id } from 'src/common/types'
import { CharacteristicType } from '../enums'

export class CreaeteCharDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  @IsEnum(CharacteristicType)
  type: CharacteristicType

  @IsNotEmpty()
  userId: Id
}
