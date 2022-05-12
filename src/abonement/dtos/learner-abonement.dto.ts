import { Expose } from 'class-transformer'
import { Id } from '../../common/types'
import { PublicUserDto } from '../../user/dtos'
import { AbonementDto } from './abonement.dto'

export class LearnerAbonementDto {
  @Expose()
  id: Id

  @Expose()
  daysLeft?: number

  @Expose()
  trainingsLeft?: number

  @Expose()
  learner: PublicUserDto

  @Expose()
  abonement: AbonementDto
}