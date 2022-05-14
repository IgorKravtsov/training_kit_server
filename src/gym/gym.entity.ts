import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { GYM_TABLE, TRAINER_GYM_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Training } from 'src/training/training.entity'
import { User } from 'src/user/user.entity'
import { Abonement } from 'src/abonement/abonement.entity'

@Entity(GYM_TABLE)
export class Gym extends CommonEntity {
  @Column()
  title: string

  @Column({ unique: true })
  address: string

  @OneToMany(() => Training, (training) => training.gym)
  trainings: Training[]

  @OneToMany(() => Abonement, (a) => a.gym)
  abonements: Abonement[]

  @ManyToMany(() => User, { onDelete: 'SET NULL' })
  @JoinTable({
    name: TRAINER_GYM_TABLE,
    joinColumn: { name: 'gymId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trainerId', referencedColumnName: 'id' },
  })
  trainers: User[]
}
