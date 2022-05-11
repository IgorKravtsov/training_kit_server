import { IsNotEmpty, IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class GetTrainerGymsDto {
  @IsNotEmpty()
  @IsNumber()
  trainerId: Id
}
