import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { nowId } from 'src/common/types'
import { TrainerGuard } from 'src/user/guards'
import { UserService } from 'src/user/user.service'
import { transformAbonement } from 'src/utils/transform/abonement.transform'
import { AbonementService } from './abonement.service'
import { AbonementDto } from './dtos/abonement.dto'
import { CreateAbonementDto } from './dtos/create-abonement.dto'

@Controller('abonement')
export class AbonementController {
  constructor(
    private userService: UserService,
    private gymService: UserService,
    private abonementService: AbonementService,
  ) {}

  @Post('create')
  @UseGuards(TrainerGuard)
  async create(@Body() body: CreateAbonementDto): Promise<AbonementDto> {
    const { creator: userId, gym: gymId, ...data } = body

    const creator = await this.userService.findOne({ id: userId as nowId })
    if (!creator) {
      throw new BadRequestException(`Не найден пользователь с id: '${userId}'`)
    }

    const gym = await this.gymService.findOne({ id: gymId as nowId })
    if (!gym) {
      throw new BadRequestException(`Не найден зал с id: '${gymId}'`)
    }

    const newAbonement = await this.abonementService.create({
      ...data,
      creator,
      gym,
    })

    return transformAbonement(newAbonement)
  }
}
