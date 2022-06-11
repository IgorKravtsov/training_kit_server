import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class GetTrainersAbonementsRequest {
  @IsNumber({}, { each: true })
  trainers: Id[]
}
