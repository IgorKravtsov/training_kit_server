import { IsEmail } from 'class-validator'
import { OrganizationDto } from '../organization.dto'

export class GetOrganizationsByEmail {
  @IsEmail()
  email: string
}

export interface GetOrganizationsByEmailResponse {
  organizations: OrganizationDto[]
}
