import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { RoomsService } from '../../service/rooms/rooms.service';
import { CreateRoomDto } from '../../model/dto/room.dto';
import { UpdateRoomDto } from '../../model/dto/room.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../service/auth/authservice/auth.guard';
@Controller('rooms')
export class RoomsController {
  constructor(private roomservice: RoomsService) { }

  @UseGuards(AuthGuard)
  @Post()
  async createroom(@Body() body: CreateRoomDto) {
    const data = await this.roomservice.createroom(body)
    return {
      message: "rooom succefully created",
      data
    }
  }


  @UseGuards(AuthGuard)
  @Get()
  async getrooms() {
    const data = await this.roomservice.findAll()
    return {
      message: "sucess",
      data
    }
  }


  @UseGuards(AuthGuard)
  @Get(":id")
  async getroombyid(@Param('id') id: string) {
    const data = await this.roomservice.findOne(id)
    return {
      message: "success",
      data
    }
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  deleteroom(@Param('id') id: string) {
    this.roomservice.remove(id)
    return {
      message: "success"
    }
  }


  @UseGuards(AuthGuard)
  @Post("joinroom/:id")
  joinroom(@Param('id') id: string, @Body() body: UpdateRoomDto) {
    const data = this.roomservice.joinroom(id, body.roomname)
    return {
      message: "success",
      data
    }
  }


  @UseGuards(AuthGuard)
  @Post("/token")
  async createtoken(@Body() body: any) {
    const data = await this.roomservice.createtoken(body.room_name, body.participant_identity)
    return {
      message: "success",
      data
    }
  }
}

