import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common'
import { transformOrganization } from 'src/utils/transform'
import { UserService } from 'src/user/user.service'
import { ORGANIZATION_TABLE } from 'src/common/constants'
import { CreateOrganizationDto, OrganizationDto } from './dtos'
import { OrganizationService } from './organization.service'
import {
  GetOrganizationsByEmail,
  GetOrganizationsByEmailResponse,
  GetOrganizationsResponse,
} from './types'

@Controller('organization')
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateOrganizationDto): Promise<OrganizationDto> {
    const o = await this.organizationService.create(body)
    return transformOrganization(o)
  }

  @Get('get-organizations')
  async getOrganizations(): Promise<GetOrganizationsResponse> {
    const organizations = await this.organizationService.all()

    return {
      organizations: organizations.map((o) => transformOrganization(o)),
    }
  }

  @Post('get-organization-by-email')
  async getOrganizationByEmail(
    @Body() body: GetOrganizationsByEmail,
  ): Promise<GetOrganizationsByEmailResponse> {
    const user = await this.userService.findOne({ email: body.email }, [
      ORGANIZATION_TABLE,
    ])
    if (!user) {
      throw new BadRequestException(
        `Пользователь с email: '${body.email}' не найден`,
      )
    }

    return {
      organizations: user.organizations.map((o) => transformOrganization(o)),
    }
  }
}
