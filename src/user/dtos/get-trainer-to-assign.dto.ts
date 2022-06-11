import { IsString } from 'class-validator'

export class GetTrainersToAssignDto {
  @IsString()
  trainer: string
}
