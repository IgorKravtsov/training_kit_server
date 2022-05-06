import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Repository } from 'typeorm'
import { Organization } from './organization.entity'

@Injectable()
export class OrganizationService extends AbstractService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationService: Repository<Organization>,
  ) {
    super(organizationService)
  }
}
