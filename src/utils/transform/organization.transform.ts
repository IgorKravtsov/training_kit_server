import { OrganizationDto } from 'src/organization/dtos'
import { Organization } from 'src/organization/organization.entity'

export const transformOrganization = (
  organization: Organization,
): OrganizationDto => {
  const { id, title, logo } = organization
  return {
    id,
    title,
    logo,
  }
}
