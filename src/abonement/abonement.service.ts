import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Abonement } from './abonement.entity'

@Injectable()
export class AbonementService extends AbstractService<Abonement> {
  constructor(
    @InjectRepository(Abonement) abonementRepository: Repository<Abonement>,
  ) {
    super(abonementRepository)
  }
}
