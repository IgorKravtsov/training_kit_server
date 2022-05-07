import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Id } from 'src/common/types'

export class CreateTrainingDto {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  descriprion?: string

  @IsDateString()
  trainingDate: Date

  @IsDateString()
  trainingTime: Date

  @IsNotEmpty()
  gymId: Id
}
