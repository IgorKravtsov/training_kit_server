import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { nowId } from 'src/common/types'
import { TrainerGuard } from 'src/user/guards'
import {
  transformAbonement,
  transformLearnerAbonement,
} from 'src/utils/transform'
import { UserService } from 'src/user/user.service'
import { GymService } from 'src/gym/gym.service'
import { AbonementService } from './abonement.service'
import { LearnerAbonementService } from './learner-abonement.service'
import { AbonementDto, AssignAbonementDto, CreateAbonementDto } from './dtos'
import { LearnerAbonementDto } from './dtos/learner-abonement.dto'

@Controller('abonement')
export class AbonementController {
  constructor(
    private userService: UserService,
    private gymService: GymService,
    private abonementService: AbonementService,
    private learnerAbonementService: LearnerAbonementService,
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

  @Post('assign-abonement')
  async assignAbonement(
    @Body() body: AssignAbonementDto,
  ): Promise<Omit<LearnerAbonementDto, 'learner' | 'abonement'>> {
    const { abonement: abonementId, learner: learnerId } = body

    const abonement = await this.abonementService.findOne({
      id: abonementId as nowId,
    })
    if (!abonement) {
      throw new BadRequestException(`Не найден абонемент с id: ${abonementId}`)
    }

    const learner = await this.userService.findOne({ id: learnerId as nowId })
    if (!learner) {
      throw new BadRequestException(
        `Не найден пользователь с id: ${abonementId}`,
      )
    }
    const newAssignedAbonement = await this.learnerAbonementService.create({
      trainingsLeft: abonement.amountTrainings,
      daysLeft: abonement.amountDays,
      learner,
      abonement,
    })

    // console.log(newAssignedAbonement)

    return transformLearnerAbonement(newAssignedAbonement)
  }
}
