export function isArrContainsObj<T, K>(
  arr: K[],
  obj: T,
  arrKey: keyof K,
  objKey: keyof T,
): boolean {
  // @ts-ignore
  return arr.filter((item) => item[arrKey][objKey] === obj[objKey]).length > 0
}
