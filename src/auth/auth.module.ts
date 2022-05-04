import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [forwardRef(() => UserModule), CommonModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
