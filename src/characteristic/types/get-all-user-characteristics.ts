import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'
import { CharacteristicDto } from 'src/characteristic/dtos/characteristic.dto'

export class GetAllUserCharacteristicsRequest {
  @IsNumber()
  userId: Id
}

export interface GetAllUserCharacteristicsResponse {
  characteristics: CharacteristicDto[]
}
