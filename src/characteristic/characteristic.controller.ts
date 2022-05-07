import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { nowId } from 'src/common/types'
import { UserService } from 'src/user/user.service'
import { Characteristic } from './characteristic.entity'
import { CharacteristicService } from './characteristic.service'
import { CreaeteCharDto } from './dtos'

@Controller('characteristic')
export class CharacteristicController {
  constructor(
    private characteristicService: CharacteristicService,
    private userServise: UserService,
  ) {}

  @Post('create')
  async create(@Body() body: CreaeteCharDto): Promise<Characteristic> {
    const { userId, ...data } = body
    const user = await this.userServise.findOne({ id: userId } as any)
    if (!user) {
      throw new BadRequestException(`Не найден пользователь с id: ${userId}`)
    }
    return await this.characteristicService.create({
      ...data,
      user: { id: userId as nowId },
    })
  }
}
