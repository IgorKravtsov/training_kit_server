import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { nowId } from 'src/common/types'
import { UserService } from 'src/user/user.service'
import { Characteristic } from './characteristic.entity'
import { CharacteristicService } from './characteristic.service'
import { CreateCharDto } from './dtos'

@Controller('characteristic')
export class CharacteristicController {
  constructor(
    private characteristicService: CharacteristicService,
    private userService: UserService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateCharDto): Promise<Characteristic> {
    const { userId, ...data } = body
    const user = await this.userService.findOne({ id: userId } as any)
    if (!user) {
      throw new BadRequestException(`Не найден пользователь с id: ${userId}`)
    }
    return await this.characteristicService.create({
      ...data,
      user,
    })
  }
}
