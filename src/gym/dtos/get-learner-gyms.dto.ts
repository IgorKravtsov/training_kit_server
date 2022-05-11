import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class GetLearnerGymsDto {
  @IsArray()
  @IsNotEmpty()
  trainers: Id[]
}
