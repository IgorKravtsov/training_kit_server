import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { Id, nowId } from 'src/common/types'
import { GymService } from 'src/gym/gym.service'
import { Serialize } from 'src/helpers/interceptors'
import { UserRoles } from 'src/user/enums'
import { UserService } from 'src/user/user.service'
import { transformTraining } from 'src/utils/transform'
import { TrainingDto } from './dtos'
import { CreateTrainingDto } from './dtos/create-training.dto'
import { TrainingService } from './training.service'

@Controller('training')
export class TrainingController {
  constructor(
    private trainingService: TrainingService,
    private userService: UserService,
    private gymService: GymService,
  ) {}

  @Post('create')
  @Serialize(TrainingDto)
  // @UseGuards(TrainerGuard)
  async create(@Body() body: CreateTrainingDto): Promise<TrainingDto> {
    const { gymId, trainers: trainerIds, ...data } = body

    const gym = await this.gymService.findOne({ id: gymId as nowId })
    if (!gym) {
      throw new NotFoundException(`Не найден зал с id: '${gymId}'`)
    }

    const { entities: trainers, isRangeCorrect } =
      await this.userService.findInRangeId(trainerIds, {}, [
        UserRoles.TRAINER,
        UserRoles.ADMIN,
      ])
    if (!isRangeCorrect) {
      throw new NotFoundException(`Заданы неверные id тренера(-ов)`)
    }

    const newTraining = await this.trainingService.create({
      ...data,
      gym,
      trainers,
    })

    return transformTraining(newTraining)
  }

  @Delete('delete/:trainingId')
  async delete(@Param('trainingId') trainingId: Id) {
    return await this.trainingService.delete(trainingId)
  }
}
