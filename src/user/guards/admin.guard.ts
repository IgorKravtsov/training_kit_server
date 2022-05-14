import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UserRoles } from 'src/user/enums'

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.currentUser

    return user?.role === UserRoles.ADMIN

    // try {
    //   const jwt = types.cookies[userInCookie]
    //   return await this.jwtService.verifyAsync(jwt)
    // } catch (e) {
    //   return false
    // }
  }
}
