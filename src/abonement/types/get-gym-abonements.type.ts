import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class GetGymAbonementsRequest {
  @IsNumber()
  gymId: Id
}
