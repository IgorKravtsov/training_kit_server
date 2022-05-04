import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractService } from 'src/common/abstract.service'
import { PaginatedResult } from 'src/common/interfaces'
import { Repository } from 'typeorm'
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
}
