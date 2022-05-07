import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { Id, nowId } from 'src/common/types'
import { CreateTrainingDto } from './dtos/create-training.dto'
import { Training } from './training.entity'
import { TrainingService } from './training.service'

@Controller('training')
export class TrainingController {
  constructor(private trainingService: TrainingService) {}

  @Post('create')
  // @UseGuards(TrainerGuard)
  async create(@Body() body: CreateTrainingDto): Promise<Training> {
    const { gymId, ...data } = body
    return await this.trainingService.create({
      ...data,
      gym: { id: gymId as nowId },
    })
  }

  @Delete('delete/:trainingId')
  async delete(@Param('trainingId') trainingId: Id) {
    return await this.trainingService.delete(trainingId)
  }
}
