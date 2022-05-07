import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { TrainerGuard } from 'src/user/guards'
import { CreateGymDto } from './dtos/create-gym.dto'
import { Gym } from './gym.entity'
import { GymService } from './gym.service'

@Controller('gym')
export class GymController {
  constructor(private gymService: GymService) {}

  @Post('create')
  // @UseGuards(TrainerGuard)
  async create(@Body() body: CreateGymDto): Promise<Gym> {
    const gym = await this.gymService.findOne({ address: body.address })
    if (gym) {
      throw new BadRequestException(
        `Зал с адресом: '${body.address}' уже существует`,
      )
    }
    return await this.gymService.create(body)
  }
}
