// import { Expose } from 'class-transformer'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Abonement } from 'src/abonement/abonement.entity'
import { LearnerAbonement } from 'src/abonement/learner-abonement.entity'
import { USER_TABLE } from 'src/common/constants'
import { CommonEntity } from 'src/common/entities'
import { Organization } from 'src/organization/organization.entity'
import { LanguageType, UserRoles } from './enums'

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

  @Column({ enum: LanguageType, default: LanguageType.RU })
  lang: LanguageType

  @Column({ nullable: true })
  level?: string

  @ManyToOne(() => Organization, (o) => o.users)
  selectedOrganization?: Organization

  @OneToMany(() => Abonement, (a) => a.creator) //Field for creators of abonements
  abonements: Abonement[]

  @OneToMany(() => LearnerAbonement, (la) => la.learner) //Field for assigned abonements
  learnerAbonements: LearnerAbonement[]

  // @ManyToOne(() => User, (u) => u.trainer)
  // trainer: User

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'trainer_learner',
    joinColumn: { name: 'learnerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trainerId', referencedColumnName: 'id' },
  })
  trainers?: User[]

  @ManyToMany(() => Organization, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'organization_user',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organizationId', referencedColumnName: 'id' },
  })
  organizations: Organization[]

  // @OneToMany(() => Abonement, )

  // @Expose()
  // get displayName(): string {
  //   return `${this.name} ${this.lastName}`
  // }
}
