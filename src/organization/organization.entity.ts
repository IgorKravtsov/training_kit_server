import { Column, Entity } from 'typeorm'
import { CommonEntity } from 'src/common/entities'
import { ORGANIZATION_TABLE } from 'src/common/constants'

@Entity(ORGANIZATION_TABLE)
export class Organization extends CommonEntity {
  @Column()
  title: string

  @Column({ nullable: true })
  logo: string
}
