import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { TrainerGuard } from 'src/user/guards'
import { transformGym } from 'src/utils/transform'
import { GymDto } from './dtos'
import { CreateGymDto } from './dtos/create-gym.dto'
import { GymService } from './gym.service'

@Controller('gym')
export class GymController {
  constructor(private gymService: GymService) {}

  @Post('create')
  // @UseGuards(TrainerGuard)
  async create(@Body() body: CreateGymDto): Promise<GymDto> {
    const gym = await this.gymService.findOne({ address: body.address })
    if (gym) {
      throw new BadRequestException(
        `Зал с адресом: '${body.address}' уже существует`,
      )
    }
    const newGym = await this.gymService.create(body)
    return transformGym(newGym)
  }
}
