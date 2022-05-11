import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { nowId } from 'src/common/types'
import { UserRoles } from 'src/user/enums'
import { TrainerGuard } from 'src/user/guards'
import { UserService } from 'src/user/user.service'
import { transformGym } from 'src/utils/transform'
import { GetLearnerGymsDto, GetTrainerGymsDto, GymDto } from './dtos'
import { CreateGymDto } from './dtos/create-gym.dto'
import { GymService } from './gym.service'

@Controller('gym')
export class GymController {
  constructor(
    private gymService: GymService,
    private userService: UserService,
  ) {}

  @Post('create')
  @UseGuards(TrainerGuard)
  async create(@Body() body: CreateGymDto): Promise<GymDto> {
    const { trainers: trainerIds, ...data } = body
    const gym = await this.gymService.findOne({ address: body.address })
    if (gym) {
      throw new BadRequestException(
        `Зал с адресом: '${body.address}' уже существует`,
      )
    }
    const { entities: trainers, isRangeCorrect } =
      await this.userService.findInRangeId(trainerIds, {}, [
        UserRoles.TRAINER,
        UserRoles.ADMIN,
      ])
    if (!isRangeCorrect) {
      throw new BadRequestException('Заданы не верные id тренеров')
    }

    const newGym = await this.gymService.create({
      ...data,
      trainers,
    })

    return transformGym(newGym)
  }

  @Post('trainer-gyms')
  // @UseGuards(TrainerGuard)
  async getTrainerGyms(@Body() body: GetTrainerGymsDto): Promise<GymDto[]> {
    const gyms = await this.gymService.findMany({
      trainers: { id: body.trainerId as nowId },
    })

    return gyms.map((gym) => transformGym(gym))
  }

  @Post('learner-gyms')
  async getLearnerGyms(@Body() body: GetLearnerGymsDto): Promise<GymDto[]> {
    const gyms = await this.gymService.findMany({
      trainers: body.trainers.map((id) => ({ id })) as any,
    })

    return gyms.map((gym) => transformGym(gym))
  }
}
