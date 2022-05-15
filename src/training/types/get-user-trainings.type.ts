import { IsArray, IsDateString, IsNotEmpty, IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class GetUserTrainingsRequest {
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  trainerIds: Id[]

  @IsDateString()
  startDate: Date

  @IsDateString()
  endDate: Date
}
