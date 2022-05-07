import { Body, Controller, Post } from '@nestjs/common'
import { CreateGymDto } from './dtos/create-gym.dto'
import { Gym } from './gym.entity'
import { GymService } from './gym.service'

@Controller('gym')
export class GymController {
  constructor(private gymService: GymService) {}

  @Post('create')
  async create(@Body() body: CreateGymDto): Promise<Gym> {
    return await this.gymService.create(body)
  }
}
