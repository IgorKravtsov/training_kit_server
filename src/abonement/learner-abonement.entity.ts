import { Column, Entity, ManyToOne } from 'typeorm'
import { LEARNER_ABONEMENT_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { User } from 'src/user/user.entity'
import { Abonement } from './abonement.entity'

@Entity(LEARNER_ABONEMENT_TABLE)
export class LearnerAbonement extends CommonEntity {
  @Column({ nullable: true })
  trainingsLeft?: number

  @Column({ nullable: true })
  daysLeft?: number

  @Column({ nullable: true })
  endDate?: Date

  @ManyToOne(() => User, (u) => u.learnerAbonements)
  learner: User

  @ManyToOne(() => Abonement, (a) => a.learnerAbonements)
  abonement: Abonement
}
