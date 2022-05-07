import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'

import { Serialize } from 'src/interceptors/serialize.interceptor'
import { UserService } from 'src/user/user.service'
import { LoginDto, RegisterDto } from './dtos'
import {
  ORGANIZATION_TABLE,
  SALT_NUMBER,
  userInCookie,
} from 'src/common/constants'
import { AuthGuard } from '../user/guards/auth.guard'
import { UserDto } from 'src/user/dtos'

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @Serialize(UserDto)
  async register(@Body() body: RegisterDto) {
    const { password, organizations, ...data } = body
    const hashedPass = await bcrypt.hash(password, SALT_NUMBER)
    return this.userService.create({
      ...data,
      password: hashedPass,
      organizations: organizations.map((id) => ({ id })),
    })
  }

  @Post('login')
  @Serialize(UserDto)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body
    const user = await this.userService.findOne({ email }, [ORGANIZATION_TABLE])

    if (!user) {
      throw new NotFoundException('User was not found')
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials')
    }
    const jwt_token = await this.jwtService.signAsync({ id: user.id }) // sign more data in future
    response.cookie(userInCookie, jwt_token, { httpOnly: true })

    return user
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @Serialize(UserDto)
  async user(@Req() request: Request) {
    //По сути не нужный метод, но пусть будет :)

    // const cookie = request.cookies[userInCookie]
    // const verifiedData = await this.jwtService.verifyAsync(cookie)
    // return this.userService.findOne({ id: verifiedData.id })
    return request.currentUser
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(userInCookie)

    return {
      message: 'Logged out successfully',
    }
  }
}
