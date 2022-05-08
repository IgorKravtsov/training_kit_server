import { Injectable } from '@nestjs/common'
import {
  DeepPartial,
  DeleteResult,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { PaginatedResult } from './interfaces'
import { Id } from './types'

@Injectable()
export abstract class AbstractService<Entity extends { id: Id }> {
  constructor(protected readonly repository: Repository<Entity>) {}

  async all(relations: string[] = []): Promise<Entity[]> {
    return await this.repository.find({ relations })
  }

  async findMany(
    condition: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    orderBy?: FindOptionsOrder<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      where: condition,
      order: orderBy,
    })
  }

  async findInRangeId(
    ids: Id[],
    orderBy?: FindOptionsOrder<Entity>,
  ): Promise<{ entities: Entity[]; isRangeCorrect: boolean }> {
    const entities = await this.findMany({ id: In(ids) as any }, orderBy)
    return {
      entities,
      isRangeCorrect: entities.length === ids.length,
    }
  }

  async paginate(
    page = 1,
    relations: string[] = [],
  ): Promise<PaginatedResult<Entity>> {
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

  async create(
    data: DeepPartial<Entity>,
  ): Promise<DeepPartial<Entity> & Entity> {
    return this.repository.save(data)
  }

  async findOne(
    condition: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    relations: string[] = [],
  ): Promise<Entity> {
    return this.repository.findOne({ relations, where: condition })
  }

  async update(
    id: Id,
    data: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return await this.repository.update(id, data)
  }

  async delete(id: Id): Promise<any> {
    await this.repository.delete(id)
    return {
      message: `Successfully deleted instance with id: '${id}'`,
    }
  }
}
