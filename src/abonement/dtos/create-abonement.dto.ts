import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Id } from 'src/common/types'

export class CreateAbonementDto {
  @IsString()
  title: string

  @IsNumber()
  price: number

  @IsNumber()
  @IsOptional()
  amountDays?: number

  @IsNumber()
  @IsOptional()
  amountTrainings?: number

  @IsNumber()
  creatorId: Id

  @IsNumber()
  gymId: Id
}
