import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Gym } from './gym.entity'

@Injectable()
export class GymService extends AbstractService<Gym> {
  constructor(
    @InjectRepository(Gym) private readonly gymService: Repository<Gym>,
  ) {
    super(gymService)
  }
}
