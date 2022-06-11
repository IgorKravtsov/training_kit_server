import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'

export class GetOneLearnerAbonementRequest {
  @IsNumber()
  abonementId: Id

  @IsNumber()
  learnerId: Id
}
