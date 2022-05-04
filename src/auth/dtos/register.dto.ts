import { IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  password: string
}
