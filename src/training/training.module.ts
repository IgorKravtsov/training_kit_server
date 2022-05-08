import { Module } from '@nestjs/common'
import { TrainingService } from './training.service'
import { TrainingController } from './training.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Training } from './training.entity'
import { UserModule } from 'src/user/user.module'
import { GymModule } from 'src/gym/gym.module'

@Module({
  imports: [TypeOrmModule.forFeature([Training]), UserModule, GymModule],
  providers: [TrainingService],
  controllers: [TrainingController],
})
export class TrainingModule {}
