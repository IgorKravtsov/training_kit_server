import { IsNotEmpty, IsString } from 'class-validator'

export class CreateGymDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  address: string
}
