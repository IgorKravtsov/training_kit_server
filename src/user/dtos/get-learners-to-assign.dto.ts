import { IsString } from "class-validator";

export class GetLearnersToAssignDto {
  @IsString()
  learner: string
}