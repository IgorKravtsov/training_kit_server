import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { TRAINING_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Gym } from 'src/gym/gym.entity'
import { User } from 'src/user/user.entity'

@Entity(TRAINING_TABLE)
export class Training extends CommonEntity {
  @Column()
  trainingDate: Date

  @Column()
  trainingTime: Date

  @ManyToOne(() => Gym, (gym) => gym.trainings)
  gym: Gym

  @ManyToMany(() => User, { onDelete: 'NO ACTION' })
  @JoinTable({
    name: 'training_user',
    joinColumn: { name: 'trainingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  learners: User[]
}
