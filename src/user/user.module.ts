import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule } from 'src/common/common.module'
import { UploadController } from 'src/user/upload.controller'
import { CurrentUserMiddleware } from './middleware/current-user.middleware'
import { User } from './user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  controllers: [UploadController, UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
