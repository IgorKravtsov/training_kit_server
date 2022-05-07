import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { nowId } from '../types'

export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  id: nowId

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
