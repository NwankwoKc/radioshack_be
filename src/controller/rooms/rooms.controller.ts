import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { RoomsService } from '../../service/rooms/rooms.service';
import { CreateRoomDto } from '../../model/dto/room.dto';
import { UpdateRoomDto } from '../../model/dto/room.dto';
@Controller('rooms')
export class RoomsController {
  constructor(private roomservice: RoomsService) { }
  @Post()
  async createroom(@Body() body: CreateRoomDto) {
    const data = await this.roomservice.createroom(body)
    return {
      message: "rooom succefully created",
      data
    }
  }
  @Get()
  async getrooms() {
    const data = await this.roomservice.findAll()
    return {
      message: "sucess",
      data
    }
  }
  @Get(":id")
  async getroombyid(@Param('id') id: string) {
    const data = await this.roomservice.findOne(id)
    return {
      message: "success",
      data
    }
  }
  @Delete(":id")
  deleteroom(@Param('id') id: string) {
    this.roomservice.remove(id)
    return {
      message: "success"
    }
  }
  @Post("joinroom/:id")
  joinroom(@Param('id') id: string, @Body() body: UpdateRoomDto) {
    const data = this.roomservice.joinroom(id, body.roomname)
    return {
      message: "success",
      data
    }
  }
  @Post("/token")
  async createtoken(@Body() body: any) {
    const data = await this.roomservice.createtoken(body.room_name, body.participant_identity)
    return {
      message: "success",
      data
    }
  }
}

