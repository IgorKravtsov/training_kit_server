import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response, NextFunction } from 'express'
import { userInCookie } from 'src/common/constants'
import { UserService } from 'src/user/user.service'
import { User as UserEntity } from 'src/user/user.entity'

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const jwt = req.cookies[userInCookie]
      const data = await this.jwtService.verifyAsync(jwt)
      if (data) {
        const user = await this.userService.findOne({ id: data.id })
        req.currentUser = user
        next()
      }
    } catch (error) {
      next()
    }
  }
}
