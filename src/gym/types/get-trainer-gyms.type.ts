import { IsNumber } from 'class-validator'
import { Id } from 'src/common/types'
import { GymDto } from 'src/gym/dtos'

export class GetTrainerGymsRequest {
  @IsNumber()
  trainerId: Id
}

export interface GetTrainerGymsResponse {
  gyms: GymDto[]
}
