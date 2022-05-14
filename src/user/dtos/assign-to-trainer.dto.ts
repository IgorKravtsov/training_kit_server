import { IsArray, IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class AssignToTrainerDto {
  @IsArray()
  @IsNumber({}, { each: true })
  trainers: Id[]

  @IsNumber()
  learner: Id
}
