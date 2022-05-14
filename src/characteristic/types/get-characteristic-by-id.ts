import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'
import { CharacteristicDto } from 'src/characteristic/dtos'

export class GetCharacteristicByIdRequest {
  @IsNumber()
  characteristicId: Id

  @IsNumber()
  userId: Id
}

export interface GetCharacteristicByIdResponse {
  characteristic: CharacteristicDto
}
