import { GymDto } from 'src/gym/dtos'
import { Gym } from 'src/gym/gym.entity'

export const transformGym = (gym: Gym): GymDto => {
  return {
    id: gym.id,
    title: gym.title,
    address: gym.address,
  }
}
