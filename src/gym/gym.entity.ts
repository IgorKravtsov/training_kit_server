import { Column, Entity } from 'typeorm'
import { GYM_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'

@Entity(GYM_TABLE)
export class Gym extends CommonEntity {
  @Column()
  title: string

  @Column({ unique: true })
  address: string
}
