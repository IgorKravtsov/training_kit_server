import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { OrganizationModule } from './organization/organization.module'
import { CharacteristicModule } from './characteristic/characteristic.module'
import { GymModule } from './gym/gym.module'
import { TrainingModule } from './training/training.module'
import { SeedModule } from './seed/seed.module'
import { AbonementModule } from './abonement/abonement.module'
import { getTypeormConfig } from './helpers/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeormConfig,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    UserModule,
    AuthModule,
    OrganizationModule,
    CharacteristicModule,
    GymModule,
    TrainingModule,
    SeedModule,
    AbonementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
