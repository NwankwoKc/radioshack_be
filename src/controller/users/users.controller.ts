import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../../service/users/users.service';
import { UserResponseDto, CreateUserDto } from '../../model/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../service/auth/authservice/auth.guard';


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

  @UseGuards(AuthGuard)
  @Get()
  async getusers() {
    const data = await this.userservice.getusers()
    return {
      mesage: 'success',
      data
    }
  }

  @UseGuards(AuthGuard)
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


  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteuser(@Param('id') id: string) {
    return await this.userservice.remove(id)
  }
}
