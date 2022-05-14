import { IsEmail } from 'class-validator'
import { OrganizationDto } from 'src/organization/dtos'

export class GetOrganizationsByEmail {
  @IsEmail()
  email: string
}

export interface GetOrganizationsByEmailResponse {
  organizations: OrganizationDto[]
}
