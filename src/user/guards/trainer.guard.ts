import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UserRoles } from 'src/user/enums'

@Injectable()
export class TrainerGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.currentUser

    return user?.role === UserRoles.TRAINER || user?.role === UserRoles.ADMIN

    // try {
    //   const jwt = request.cookies[userInCookie]
    //   return await this.jwtService.verifyAsync(jwt)
    // } catch (e) {
    //   return false
    // }
  }
}
