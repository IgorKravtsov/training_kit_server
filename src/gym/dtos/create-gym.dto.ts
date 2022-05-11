import { IsArray, IsNotEmpty, IsString } from 'class-validator'
import { Id } from 'src/common/types'

export class CreateGymDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  address: string

  @IsArray()
  @IsNotEmpty()
  trainers: Id[]
}
