import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GymController } from './gym.controller'
import { Gym } from './gym.entity'
import { GymService } from './gym.service'

@Module({
  imports: [TypeOrmModule.forFeature([Gym])],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
