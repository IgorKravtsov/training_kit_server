import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateOrganizationDto {
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  logo?: string
}
