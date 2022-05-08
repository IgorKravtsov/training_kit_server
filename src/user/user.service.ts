import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { CHARACTERISTIC_TABLE, ORGANIZATION_TABLE } from 'src/common/constants'
import { PaginatedResult } from 'src/common/interfaces'
import { Id } from 'src/common/types'
import { FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserRoles } from './enums'
import { User } from './user.entity'

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult<User>> {
    const { data, meta } = await super.paginate(page, relations)
    return {
      data: data.map((user) => {
        const { password, ...data } = user
        return data
      }),
      meta,
    }
  }

  async updateUser(id: Id, body: UpdateUserDto): Promise<User> {
    const { organizations, ...data } = body
    console.log(id)

    await super.update(id, {
      ...data,
      organizations: organizations?.map((id) => ({ id })),
    })
    return await this.userRepository.findOne({
      where: { id } as any,
      relations: [ORGANIZATION_TABLE],
    })
  }

  async findInRangeId(
    ids: Id[],
    orderBy?: FindOptionsOrder<User>,
    roles?: UserRoles[],
  ): Promise<{ entities: User[]; isRangeCorrect: boolean }> {
    const entities = await this.repository.find({
      where: { id: In(ids), role: In(roles) },
      order: orderBy,
    })
    return {
      entities,
      isRangeCorrect: entities.length === ids.length,
    }
  }
}
