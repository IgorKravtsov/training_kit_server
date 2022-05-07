import { Injectable } from '@nestjs/common'
import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { PaginatedResult } from './interfaces'
import { Id } from './types'

@Injectable()
export abstract class AbstractService<T extends { id: Id }> {
  constructor(protected readonly repository: Repository<T>) {}

  async all(relations: string[] = []): Promise<T[]> {
    return this.repository.find({ relations })
  }

  async paginate(
    page = 1,
    relations: string[] = [],
  ): Promise<PaginatedResult<T>> {
    const take = 15

    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    })

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    }
  }

  async create(data: DeepPartial<T>): Promise<DeepPartial<T> & T> {
    return this.repository.save(data)
  }

  async findOne(
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations: string[] = [],
  ): Promise<T> {
    return this.repository.findOne({ relations, where: condition })
  }

  async update(id: Id, data: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return await this.repository.update(id, data)
  }

  async delete(id: Id): Promise<DeleteResult> {
    return this.repository.delete(id)
  }
}
