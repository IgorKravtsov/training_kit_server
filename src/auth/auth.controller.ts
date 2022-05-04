import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    const hashedPass = await bcrypt.hash(body.password, 12)
    return this.userService.create({
      name: body.name,
      password: hashedPass,
    })
  }
}
