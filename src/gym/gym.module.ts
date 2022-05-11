import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { GymController } from './gym.controller'
import { Gym } from './gym.entity'
import { GymService } from './gym.service'

@Module({
  imports: [TypeOrmModule.forFeature([Gym]), UserModule],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
