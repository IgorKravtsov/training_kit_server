import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class AssignLearnersDto {
  @IsNumber()
  trainerId: Id

  @IsNumber({}, { each: true })
  learnerIds: Id[]
}
