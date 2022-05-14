import { Id } from 'src/common/types'

export function arrDiff<T extends { id: Id }>(
  arr1: Array<T>,
  arr2: Array<T>,
): Array<T> {
  return arr1.filter(({ id: id1 }) => !arr2.some(({ id: id2 }) => id2 === id1))
}
