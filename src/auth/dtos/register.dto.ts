import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
} from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  organizations: number[]
}
