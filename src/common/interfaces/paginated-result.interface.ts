export interface PaginatedResult<T> {
  data: Partial<T>[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}
