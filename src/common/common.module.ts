import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from './constants'

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule],
})
export class CommonModule {}
