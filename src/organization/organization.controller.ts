import { Body, Controller, Post } from '@nestjs/common'
import { transformOrganization } from 'src/utils/transform'
import { CreateOrganizationDto, OrganizationDto } from './dtos'
import { OrganizationService } from './organization.service'

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Post('create')
  async create(@Body() body: CreateOrganizationDto): Promise<OrganizationDto> {
    const o = await this.organizationService.create(body)
    return transformOrganization(o)
  }
}
