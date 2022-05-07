// import { Expose } from 'class-transformer'
import { USER_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Organization } from 'src/organization/organization.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { UserRoles } from './enums'

@Entity(USER_TABLE)
export class User extends CommonEntity {
  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column()
  lastName: string

  @Column()
  password: string

  @Column({ enum: UserRoles, default: UserRoles.LEARNER })
  role: UserRoles

  @ManyToMany(() => Organization, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'organization_user',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organizationId', referencedColumnName: 'id' },
  })
  organizations: Organization[]

  // @Expose()
  // get displayName(): string {
  //   return `${this.name} ${this.lastName}`
  // }
}
