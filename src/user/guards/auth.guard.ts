import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.currentUser

    return !!user

    // try {
    //   const jwt = types.cookies[userInCookie]
    //   return await this.jwtService.verifyAsync(jwt)
    // } catch (e) {
    //   return false
    // }
  }
}
