import { Column, Entity, ManyToOne } from 'typeorm'
import { CommonEntity } from 'src/common/entities'
import { CharacteristicType } from './enums'
import { User } from 'src/user/user.entity'
import { CHARACTERISTIC_TABLE } from 'src/common/constants'

@Entity(CHARACTERISTIC_TABLE)
export class Characteristic extends CommonEntity {
  @Column()
  title: string

  @Column({ enum: CharacteristicType })
  type: CharacteristicType

  @ManyToOne(() => User, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User
}
