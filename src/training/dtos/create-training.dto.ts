import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Id } from 'src/common/types'

export class CreateTrainingDto {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsDateString()
  trainingDateTime: Date

  // @IsDateString()
  // trainingTime: Date

  @IsNotEmpty()
  gymId: Id

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  trainers: Id[]

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  learners?: Id[]
}
