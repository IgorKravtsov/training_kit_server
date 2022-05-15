import { Expose, Transform } from 'class-transformer'
import { Id } from 'src/common/types'
import { GymDto } from 'src/gym/dtos'
import { PublicUserDto } from 'src/user/dtos'

export class TrainingDto {
  @Expose()
  id: Id

  @Expose()
  title: string

  @Expose()
  description: string

  @Expose()
  trainingDate: Date

  @Expose()
  trainingTime: Date

  @Transform(({ obj }) => ({ title: obj.title, address: obj.address }))
  @Expose()
  gym?: GymDto

  @Expose()
  trainers: PublicUserDto[]

  @Expose()
  learners: PublicUserDto[]
}
