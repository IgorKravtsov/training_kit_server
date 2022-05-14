import { IsArray, IsNotEmpty } from 'class-validator'
import { Id } from 'src/common/types'
import { GymDto } from 'src/gym/dtos'

export class GetLearnerGymsRequest {
  @IsArray()
  @IsNotEmpty()
  trainers: Id[]
}

export interface GetLearnerGymsResponse {
  gyms: GymDto[]
}
