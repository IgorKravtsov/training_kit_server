import { GymDto } from 'src/gym/dtos'
import { TrainingDto } from 'src/training/dtos'

export interface GymTraining {
  gym: GymDto
  trainings: TrainingDto[]
}