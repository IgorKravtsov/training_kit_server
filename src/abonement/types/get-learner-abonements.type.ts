import { IsNotEmpty } from 'class-validator'
import { Id } from 'src/common/types'

export class GetLearnerAbonementsRequest {
  @IsNotEmpty()
  learnerId: Id
}

export interface GetLearnerAbonementsResponse {}
