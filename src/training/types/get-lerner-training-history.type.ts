import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { Id } from 'src/common/types'
import { TrainingDto } from 'src/training/dtos'

export class GetLernerTrainingHistoryRequest {
  @IsNumber()
  learnerId: Id

  @IsNumber()
  @IsOptional()
  @IsPositive()
  days?: number
}

export interface GetLearnerTrainingHistoryResponse {
  count: number
  trainings: TrainingDto[]
}
