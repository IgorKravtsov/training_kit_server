import { Body, Controller, Delete, Param, Put } from '@nestjs/common'
import { Id } from 'src/common/types'
import { Serialize } from 'src/interceptors'
import { UserDto } from './dtos'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('update/:userId')
  @Serialize(UserDto)
  async update(@Param('userId') userId: Id, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(userId, body)
  }

  @Delete('delete/:userId')
  async delete(@Param('userId') userId: Id) {
    await this.userService.delete(userId)
    return {
      message: 'Deleted successfully',
    }
  }
}
