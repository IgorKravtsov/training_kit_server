import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { nowId } from 'src/common/types'
import { UserService } from 'src/user/user.service'
import { CHARACTERISTIC_TABLE } from 'src/common/constants'
import { transformCharacteristicOnly } from 'src/utils/transform'
import { Characteristic } from './characteristic.entity'
import { CharacteristicService } from './characteristic.service'
import { CreateCharDto } from './dtos'
import {
  GetAllUserCharacteristicsRequest,
  GetAllUserCharacteristicsResponse,
  GetCharacteristicByIdRequest,
  GetCharacteristicByIdResponse,
} from './types'

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

  @Get('get-all-user-characteristics')
  async getAllUserCharacteristics(
    @Body() body: GetAllUserCharacteristicsRequest,
  ): Promise<GetAllUserCharacteristicsResponse> {
    const user = await this.userService.findOne({ id: body.userId as nowId }, [
      CHARACTERISTIC_TABLE,
    ])

    return {
      characteristics: user.characteristics.map((c) =>
        transformCharacteristicOnly(c),
      ),
    }
  }

  @Post('get-characteristic-by-id')
  async getCharacteristicById(
    @Body() body: GetCharacteristicByIdRequest,
  ): Promise<GetCharacteristicByIdResponse> {
    const { characteristicId, userId } = body
    const user = await this.userService.findOne({ id: userId as nowId }, [
      CHARACTERISTIC_TABLE,
    ])

    if (!user) {
      throw new BadRequestException(`Пользователь с id: ${userId} не найден`)
    }
    if (!user.characteristics || user.characteristics.length === 0) {
      throw new NotFoundException(
        `У пользователя с id: ${userId} не найдены характеристики`,
      )
    }

    const characteristic = user.characteristics.find(
      (c) => c.id === characteristicId,
    )

    return {
      characteristic: transformCharacteristicOnly(characteristic),
    }
  }
}
