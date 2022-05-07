import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Repository } from 'typeorm'
import { Characteristic } from './characteristic.entity'

@Injectable()
export class CharacteristicService extends AbstractService<Characteristic> {
  constructor(
    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,
  ) {
    super(characteristicRepository)
  }
}
