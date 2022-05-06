import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  logo: string
}
