import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { nowId } from 'src/common/types'
import { UserRoles } from 'src/user/enums'
import { TrainerGuard } from 'src/user/guards'
import { UserService } from 'src/user/user.service'
import { transformGym } from 'src/utils/transform'
import { GYMS_RELATION } from 'src/common/constants'
import { CreateGymDto, GymDto } from './dtos'
import { GymService } from './gym.service'
import {
  GetLearnerGymsRequest,
  GetLearnerGymsResponse,
  GetTrainerGymsRequest,
  GetTrainerGymsResponse,
} from './types'

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

  // @Get('trainer-gyms')

  @Post('trainer-gyms')
  // @UseGuards(TrainerGuard)
  async getTrainerGyms(
    @Body() body: GetTrainerGymsRequest,
  ): Promise<GetTrainerGymsResponse> {
    const trainer = await this.userService.findOne(
      { id: body.trainerId as nowId },
      [GYMS_RELATION],
    )

    if (!trainer) {
      throw new BadRequestException(`Тренер с id: ${body.trainerId} не найден`)
    }

    if (!trainer.gyms || trainer.gyms.length === 0) {
      throw new NotFoundException(
        `У тренера с id: ${body.trainerId} не найдено залов`,
      )
    }

    return {
      gyms: trainer.gyms.map((gym) => transformGym(gym)),
    }
  }

  @Post('learner-gyms')
  async getLearnerGyms(
    @Body() body: GetLearnerGymsRequest,
  ): Promise<GetLearnerGymsResponse> {
    const gyms = await this.gymService.findMany({
      trainers: body.trainers.map((id) => ({ id })) as any,
    })

    if (!gyms) {
      throw new NotFoundException(
        `У тренеров с id среди: '${body.trainers}' не найдено залов`,
      )
    }

    return {
      gyms: gyms.map((gym) => transformGym(gym)),
    }
  }
}
