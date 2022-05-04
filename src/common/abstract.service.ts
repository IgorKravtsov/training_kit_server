import { Injectable } from '@nestjs/common'
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { PaginatedResult } from './interfaces'
import { Id } from './types'

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async all(relations = []): Promise<T[]> {
    return this.repository.find({ relations })
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult<T>> {
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

  async create(data: DeepPartial<T>): Promise<any> {
    return this.repository.save(data)
  }

  async findOne(condition: FindOptionsWhere<T>, relations = []): Promise<T> {
    return this.repository.findOne({ relations, where: condition })
  }

  async update(id: Id, data: QueryDeepPartialEntity<T>): Promise<any> {
    return this.repository.update(id, data)
  }

  async delete(id: Id): Promise<any> {
    return this.repository.delete(id)
  }
}
