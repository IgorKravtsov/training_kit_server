import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { CommonModule } from 'src/common/common.module'
import { OrganizationModule } from 'src/organization/organization.module'

@Module({
  imports: [forwardRef(() => UserModule), CommonModule, OrganizationModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
