import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { userInCookie } from 'src/common/constants'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    try {
      const jwt = request.cookies[userInCookie]
      return await this.jwtService.verifyAsync(jwt)
    } catch (e) {
      return false
    }
  }
}
