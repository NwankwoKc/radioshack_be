import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Rooms } from "./rooms"
import { RoomsService } from "src/service/rooms/rooms.service"
import { RoomsController } from "src/controller/rooms/rooms.controller"
import { Users } from "../users/users"
@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Users])],
  exports: [TypeOrmModule],
  providers: [RoomsService],
  controllers: [RoomsController]
})
export class RoomsModule { }
