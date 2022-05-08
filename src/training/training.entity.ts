import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { TRAINING_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Gym } from 'src/gym/gym.entity'
import { User } from 'src/user/user.entity'

@Entity(TRAINING_TABLE)
export class Training extends CommonEntity {
  @Column()
  title: string

  @Column()
  description: string

  @Column()
  trainingDate: Date

  @Column()
  trainingTime: Date

  @ManyToOne(() => Gym, (gym) => gym.trainings)
  gym: Gym

  @ManyToMany(() => User, { onDelete: 'NO ACTION' })
  @JoinTable({
    name: 'training_learner',
    joinColumn: { name: 'trainingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'learnerId', referencedColumnName: 'id' },
  })
  learners: User[]

  @ManyToMany(() => User, { onDelete: 'NO ACTION' })
  @JoinTable({
    name: 'training_trainer',
    joinColumn: { name: 'trainingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trainerId', referencedColumnName: 'id' },
  })
  trainers: User[]
}
