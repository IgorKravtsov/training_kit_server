import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GymModule } from 'src/gym/gym.module'
import { UserModule } from 'src/user/user.module'
import { AbonementController } from './abonement.controller'
import { Abonement } from './abonement.entity'
import { AbonementService } from './abonement.service'
import { LearnerAbonement } from './learner-abonement.entity'
import { LearnerAbonementService } from './learner-abonement.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Abonement, LearnerAbonement]),
    UserModule,
    GymModule,
  ],
  controllers: [AbonementController],
  providers: [AbonementService, LearnerAbonementService],
  exports: [AbonementService],
})
export class AbonementModule {}
