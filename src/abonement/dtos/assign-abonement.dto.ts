import { IsNumber, IsOptional } from 'class-validator'
import { Id } from 'src/common/types'

export class AssignAbonementDto {
  // @IsNumber()
  // @IsOptional()
  // trainingsLeft?: number
  //
  // @IsNumber()
  // @IsOptional()
  // daysLeft?: number

  @IsNumber()
  learner: Id

  @IsNumber()
  abonement: Id
}
