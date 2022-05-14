import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { Id, nowId } from 'src/common/types'
import { transformUser } from 'src/utils/transform'
import { arrDiff } from 'src/utils'
import { ORGANIZATION_TABLE, TRAINERS_RELATION } from 'src/common/constants'
import { UpdateUserDto, UserDto } from './dtos'
import { UserService } from './user.service'
import { AssignToTrainerDto } from './dtos/assign-to-trainer.dto'
import { UserRoles } from './enums'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('update/:userId')
  // @Serialize(UserDto)
  async update(@Param('userId') userId: Id, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(userId, body)
  }

  @Delete('delete/:userId')
  async delete(@Param('userId') userId: Id) {
    return await this.userService.delete(userId)
  }

  @Post('assign-to-trainer')
  async assignToTrainer(@Body() body: AssignToTrainerDto): Promise<UserDto> {
    const { trainers: trainerIds, learner: learnerId } = body
    const { isRangeCorrect, entities: trainers } =
      await this.userService.findInRangeId(trainerIds, {}, [
        UserRoles.TRAINER,
        UserRoles.ADMIN,
      ])

    if (!isRangeCorrect) {
      throw new BadRequestException('Заданы не верные id тренеров')
    }

    const learner = await this.userService.findOne({ id: learnerId as nowId })
    if (!learner) {
      throw new BadRequestException(`Не найден ученик с id: ${learnerId}`)
    }
    const learnerTrainers = learner.trainers

    learnerTrainers &&
      learnerTrainers.push(...arrDiff(learnerTrainers, trainers))

    await this.userService.create({
      ...learner,
      trainers: learnerTrainers || trainers,
    })
    const updatedLearner = await this.userService.findOne(
      {
        id: learnerId as nowId,
      },
      [ORGANIZATION_TABLE, TRAINERS_RELATION],
    )
    return transformUser(updatedLearner)
  }
}
