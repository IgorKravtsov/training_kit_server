import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getTypeormConfig } from './config/typeorm.config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { OrganizationModule } from './organization/organization.module'
import { CharacteristicModule } from './characteristic/characteristic.module'
import { GymModule } from './gym/gym.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: getTypeormConfig,
    // }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    OrganizationModule,
    CharacteristicModule,
    GymModule,
    TrainingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
