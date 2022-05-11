import { Module } from '@nestjs/common'
import { SeedController } from './seed.controller'
import { UserModule } from 'src/user/user.module'
import { GymModule } from 'src/gym/gym.module'
import { CharacteristicModule } from 'src/characteristic/characteristic.module'
import { OrganizationModule } from 'src/organization/organization.module'
import { TrainingModule } from 'src/training/training.module'
import { AbonementModule } from 'src/abonement/abonement.module'

@Module({
  imports: [
    UserModule,
    GymModule,
    CharacteristicModule,
    OrganizationModule,
    TrainingModule,
    AbonementModule,
  ],
  providers: [],
  controllers: [SeedController],
})
export class SeedModule {}
