import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Repository } from 'typeorm'
import { Training } from './training.entity'

@Injectable()
export class TrainingService extends AbstractService<Training> {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
  ) {
    super(trainingRepository)
  }
}
