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
import { UserService } from 'src/user/user.service'
import { LoginDto, RegisterDto } from './dtos'
import {
  ABONEMENT_TABLE,
  CHARACTERISTIC_TABLE,
  GYM_TABLE,
  LEARNER_ABONEMENT_RELATION,
  ORGANIZATION_TABLE,
  SALT_NUMBER,
  TRAINERS_RELATION,
  USER_IN_COOKIE,
} from 'src/common/constants'
import { AuthGuard } from 'src/user/guards'
import { UserDto } from 'src/user/dtos'
import { OrganizationService } from 'src/organization/organization.service'
import { transformUser } from 'src/utils/transform'

@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private organizationService: OrganizationService,
  ) {}

  @Post('auth/register')
  // @Serialize(UserDto)
  async register(@Body() body: RegisterDto): Promise<UserDto> {
    const { password, organizations: organizationIds, ...data } = body

    const { entities: organizations, isRangeCorrect: isRangePass } =
      await this.organizationService.findInRangeId(organizationIds)
    if (!isRangePass) {
      throw new BadRequestException('Заданы неверные id организации(-й)')
    }

    const hashedPass = await bcrypt.hash(password, SALT_NUMBER)

    const newUser = await this.userService.create({
      ...data,
      password: hashedPass,
      organizations,
    })

    return transformUser(newUser)
  }

  @Post('auth/login')
  // @Serialize(UserDto)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDto> {
    const { email, password } = body
    const user = await this.userService.findOne({ email }, [ORGANIZATION_TABLE])

    if (!user) {
      throw new NotFoundException('User was not found')
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials')
    }
    const jwt_token = await this.jwtService.signAsync({ id: user.id }) // sign more data in future
    response.cookie(USER_IN_COOKIE, jwt_token, { httpOnly: true })

    return transformUser(user)
  }

  @UseGuards(AuthGuard)
  @Get('user')
  // @Serialize(UserDto)
  async user(@Req() request: Request): Promise<UserDto> {
    const user = await this.userService.findOne(
      { id: request.currentUser.id },
      [
        TRAINERS_RELATION,
        LEARNER_ABONEMENT_RELATION,
        ABONEMENT_TABLE,
        ORGANIZATION_TABLE,
        CHARACTERISTIC_TABLE,
        GYM_TABLE,
      ],
    )

    return transformUser(user)
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(USER_IN_COOKIE)

    return {
      message: 'Logged out successfully',
    }
  }
}
