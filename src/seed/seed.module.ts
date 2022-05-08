import { Module } from '@nestjs/common'
import { SeedController } from './seed.controller'
import { UserModule } from 'src/user/user.module'
import { GymModule } from 'src/gym/gym.module'
import { CharacteristicModule } from 'src/characteristic/characteristic.module'
import { OrganizationModule } from 'src/organization/organization.module'
import { TrainingModule } from 'src/training/training.module'

@Module({
  imports: [
    UserModule,
    GymModule,
    CharacteristicModule,
    OrganizationModule,
    TrainingModule,
  ],
  providers: [],
  controllers: [SeedController],
})
export class SeedModule {}
