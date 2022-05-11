import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { ABONEMENT_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { User } from 'src/user/user.entity'
import { Gym } from 'src/gym/gym.entity'
import { LearnerAbonement } from './learner-abonement.entity'

@Entity(ABONEMENT_TABLE)
export class Abonement extends CommonEntity {
  @Column()
  title: string

  @Column()
  price: number

  @Column({ nullable: true })
  amountDays?: number

  @Column({ nullable: true })
  amountTrainings?: number

  // @Column()
  // options: AbonementOption[]

  @ManyToOne(() => User, (u) => u.abonements)
  creator: User

  @ManyToOne(() => Gym, (g) => g.abonements)
  gym: Gym

  @OneToMany(() => LearnerAbonement, (la) => la.abonement)
  learnerAbonements: LearnerAbonement[]
}
