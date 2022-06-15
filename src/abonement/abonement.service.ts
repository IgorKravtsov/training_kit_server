import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { Abonement } from './abonement.entity'
import { Id } from 'src/common/types'
import { CREATOR_RELATION } from 'src/common/constants'

@Injectable()
export class AbonementService extends AbstractService<Abonement> {
  constructor(
    @InjectRepository(Abonement) abonementRepository: Repository<Abonement>,
  ) {
    super(abonementRepository)
  }

  async getTrainerAbonements(trainerIds: Id[]): Promise<Abonement[]> {
    const abonements: Abonement[][] = []
    for (const id of trainerIds) {
      const abonement = await this.findMany({ creator: { id } as any }, [
        CREATOR_RELATION,
      ])
      abonements.push(abonement)
    }
    return abonements.flat()
  }
}
