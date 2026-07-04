import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from 'src/service/users/users.service';
import { UserResponseDto, CreateUserDto } from 'src/model/dto/user.dto';
import { RoomsService } from 'src/service/rooms/rooms.service';

export interface Responseinterface {
  message: string,
  data: UserResponseDto
}
type updatebody = {
  id: string,
  uid: string
}

@Controller('users')
export class UsersController {
  constructor(private userservice: UsersService) { }
  @Get()
  async getusers() {
    const data = await this.userservice.getusers()
    return {
      mesage: 'success',
      data
    }
  }

  @Get(':id')
  async finduser(@Param('id') id: string) {
    const data = await this.userservice.finduser(id)
    return {
      message: 'success',
      data
    }
  }
  @Post()
  async createuser(@Body() body: CreateUserDto): Promise<Responseinterface> {
    const data = await this.userservice.createuser(body)
    return {
      message: 'success',
      data
    }
  }
  @Delete(':id')
  async deleteuser(@Param('id') id: string) {
    return await this.userservice.remove(id)
  }
}
