import { Id } from 'src/common/types'
import { IsNumber } from 'class-validator'

export class MarkVisitingTrainingRequest {
  @IsNumber()
  trainingId: Id

  @IsNumber()
  userId: Id
}
