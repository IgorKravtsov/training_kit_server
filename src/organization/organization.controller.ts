import { Body, Controller, Post } from '@nestjs/common'
import { CreateOrganizationDto } from './dtos'
import { OrganizationService } from './organization.service'

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Post('create')
  async create(@Body() body: CreateOrganizationDto) {
    return this.organizationService.create(body)
  }
}
