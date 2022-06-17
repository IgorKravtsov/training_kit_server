export function isArrContains<T>(
  arr1: Array<T>,
  arr2: Array<T>,
  key: keyof T,
): boolean {
  return arr2.every((secondElem) =>
    arr1.find((firstElem) => firstElem[key] === secondElem[key]),
  )
}
