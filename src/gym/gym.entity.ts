import { Column, Entity, OneToMany } from 'typeorm'
import { GYM_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Training } from 'src/training/training.entity'

@Entity(GYM_TABLE)
export class Gym extends CommonEntity {
  @Column()
  title: string

  @Column({ unique: true })
  address: string

  @OneToMany(() => Training, (training) => training.gym)
  trainings: Training[]
}
