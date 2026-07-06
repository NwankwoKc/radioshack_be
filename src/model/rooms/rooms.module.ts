import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Rooms } from "./rooms"
import { RoomsService } from "../../service/rooms/rooms.service"
import { RoomsController } from "../../controller/rooms/rooms.controller"
import { Users } from "../users/users"
import { EnviromentserviceService } from "../../service/enviromentservice/enviromentservice.service"
@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Users])],
  exports: [TypeOrmModule],
  providers: [RoomsService, EnviromentserviceService],
  controllers: [RoomsController]
})
export class RoomsModule { }
