import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Repository } from 'typeorm'
import { LearnerAbonement } from './learner-abonement.entity'

@Injectable()
export class LearnerAbonementService extends AbstractService<LearnerAbonement> {
  constructor(
    @InjectRepository(LearnerAbonement)
    learnerAbonementRepository: Repository<LearnerAbonement>,
  ) {
    super(learnerAbonementRepository)
  }
}
