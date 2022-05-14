import { Column, Entity, OneToMany } from 'typeorm'
import { CommonEntity } from 'src/common/entities'
import { ORGANIZATION_TABLE } from 'src/common/constants'
import { User } from '../user/user.entity'

@Entity(ORGANIZATION_TABLE)
export class Organization extends CommonEntity {
  @Column()
  title: string

  @Column({ nullable: true })
  logo: string

  @OneToMany(() => User, (u) => u.selectedOrganization)
  users: User[]
}
