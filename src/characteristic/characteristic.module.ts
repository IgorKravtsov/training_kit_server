import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CharacteristicService } from './characteristic.service'
import { CharacteristicController } from './characteristic.controller'
import { Characteristic } from './characteristic.entity'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Characteristic]), UserModule],
  providers: [CharacteristicService],
  controllers: [CharacteristicController],
})
export class CharacteristicModule {}
