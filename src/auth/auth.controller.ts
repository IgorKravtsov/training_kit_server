import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import { Serialize } from 'src/interceprots/serialize.interceptor'
import { RegisterDto, UserDto } from './dtos'

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const hashedPass = await bcrypt.hash(body.password, 12)
    return this.userService.create({
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      password: hashedPass,
    })
  }
}
