import { Column, Entity, ManyToOne } from 'typeorm'
import { TRAINING_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Gym } from 'src/gym/gym.entity'

@Entity(TRAINING_TABLE)
export class Training extends CommonEntity {
  @Column()
  trainingDate: Date

  @Column()
  trainingTime: Date

  @ManyToOne(() => Gym, (gym) => gym.trainings)
  gym: Gym
}
