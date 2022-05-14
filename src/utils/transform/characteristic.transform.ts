import { Characteristic } from 'src/characteristic/characteristic.entity'
import { CharacteristicDto } from 'src/characteristic/dtos'
import { transformPublicUser } from './user.transform'

export const transformCharacteristic = (
  characteristic: Characteristic,
): CharacteristicDto => {
  const { id, title, type, user } = characteristic
  return {
    id,
    title,
    type,
    user: user && transformPublicUser(user),
  }
}
