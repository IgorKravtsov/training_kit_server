import { IsArray, IsOptional, IsString } from 'class-validator'
import { Id } from 'src/common/types'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsArray({ each: true })
  @IsOptional()
  organizations?: number[]
}
