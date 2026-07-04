import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Rooms } from "./rooms"
import { RoomsService } from "src/service/rooms/rooms.service"
import { RoomsController } from "src/controller/rooms/rooms.controller"
import { Users } from "../users/users"
import { EnviromentserviceService } from "src/service/enviromentservice/enviromentservice.service"
@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Users])],
  exports: [TypeOrmModule],
  providers: [RoomsService, EnviromentserviceService],
  controllers: [RoomsController]
})
export class RoomsModule { }
