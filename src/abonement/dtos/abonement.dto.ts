import { Expose } from 'class-transformer'
import { Id } from 'src/common/types'
import { GymDto } from 'src/gym/dtos'
import { PublicUserDto } from 'src/user/dtos'

export class AbonementDto {
  @Expose()
  id: Id

  @Expose()
  title: string

  @Expose()
  price: number

  @Expose()
  amountDays?: number

  @Expose()
  amountTrainings?: number

  @Expose()
  creator: PublicUserDto

  @Expose()
  gym: GymDto
}
