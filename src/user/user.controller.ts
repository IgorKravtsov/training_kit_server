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
import {
  transformPublicUser,
  transformTraining,
  transformUser,
} from 'src/utils/transform'
import { arrDiff } from 'src/utils'
import {
  ABONEMENT_TABLE,
  CHARACTERISTIC_TABLE,
  GYM_TABLE,
  LEARNERS_RELATION,
  LEARNER_ABONEMENT_RELATION,
  ORGANIZATION_TABLE,
  TRAINERS_RELATION,
} from 'src/common/constants'
import {
  AssignLearnersDto,
  AssignToTrainersDto,
  ChangeLangDto,
  GetLearnersToAssignDto,
  GetTrainerLearnersDto,
  GetTrainersToAssignDto,
  GetTrainerTrainingsDto,
  PublicUserDto,
  UpdateUserDto,
  UserDto,
} from './dtos'
import { UserService } from './user.service'
import { LanguageType, UserRoles } from './enums'
import { TrainingDto } from 'src/training/dtos'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('update/:userId')
  // @Serialize(UserDto)
  async update(@Param('userId') userId: Id, @Body() body: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(userId, body)
    return transformUser(updatedUser)
  }

  @Put('change-language/:userId')
  // @Serialize(UserDto)
  async changeLang(@Param('userId') userId: Id, @Body() body: ChangeLangDto) {
    const { lang } = body
    if (!Object.values(LanguageType).includes(lang)) {
      throw new BadRequestException(`Неверный тип языка: ${lang}`)
    }
    const updatedUser = await this.userService.updateLang(userId, body)
    return transformUser(updatedUser)
  }

  @Delete('delete/:userId')
  async delete(@Param('userId') userId: Id) {
    return await this.userService.delete(userId)
  }

  @Post('assign-to-trainers')
  async assignToTrainers(@Body() body: AssignToTrainersDto): Promise<UserDto> {
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
      [
        TRAINERS_RELATION,
        LEARNER_ABONEMENT_RELATION,
        ABONEMENT_TABLE,
        ORGANIZATION_TABLE,
        CHARACTERISTIC_TABLE,
        GYM_TABLE,
      ],
    )
    return transformUser(updatedLearner)
  }

  @Post('assign-learners')
  async assignLearner(@Body() body: AssignLearnersDto) {
    const { learnerIds, trainerId } = body
    let resMessage = 'ok'

    const { isRangeCorrect, entities: learnersToAssign } =
      await this.userService.findInRangeId(learnerIds)

    if (!isRangeCorrect) {
      throw new BadRequestException(
        `Заданы не верные id учеников: ${learnerIds}`,
      )
    }

    const trainer = await this.userService.findOne({ id: trainerId as nowId })
    if (!trainer) {
      throw new BadRequestException(`Не найден тренер с id: ${trainerId}`)
    }
    const trainerLearners = await this.userService.getTrainerLearners(trainerId)

    const newLearners = arrDiff(learnersToAssign, trainerLearners)
    if (newLearners.length === 0) {
      resMessage = 'Все ученики уже являются Вашими'
    }

    await this.userService.addLeanersToTrainer(
      trainerId,
      newLearners.map((nl) => nl.id),
    )
    return { message: resMessage }
  }

  @Post('get-trainers-to-assign')
  async getTrainersToAssign(
    @Body() body: GetTrainersToAssignDto,
  ): Promise<PublicUserDto[]> {
    const { trainer } = body
    const trainers = await this.userService.findByNameLastNameOrEmail(trainer)

    return trainers.map(transformPublicUser)
  }

  @Post('get-learners-to-assign')
  async getLearnersToAssign(
    @Body() body: GetLearnersToAssignDto,
  ): Promise<PublicUserDto[]> {
    const { learner } = body

    const learners = await this.userService.findLearnerByNameLastNameOrEmail(
      learner,
    )

    return learners.map(transformPublicUser)
  }

  @Post('get-trainer-learners')
  async getTrainerLearners(
    @Body() body: GetTrainerLearnersDto,
  ): Promise<PublicUserDto[]> {
    const { trainerId } = body

    const trainer = await this.userService.findOne({ id: trainerId as nowId })
    if (!trainer) {
      throw new BadRequestException(`Не найден тренер с id: ${trainerId}`)
    }

    const learners = await this.userService.getTrainerLearners(trainerId)

    return learners.map(transformPublicUser)
  }

  @Post('get-trainer-trainings')
  async getTrainerTrainings(
    @Body() body: GetTrainerTrainingsDto,
  ): Promise<TrainingDto[]> {
    const { trainerId } = body

    const trainer = await this.userService.findOne({
      id: trainerId as nowId,
    })
    if (!trainer) {
      throw new BadRequestException(`Не найден тренер с id: ${trainerId}`)
    }

    const trainings = await this.userService.getTrainerTrainings(trainerId)

    return trainings.map(transformTraining)
  }
}
