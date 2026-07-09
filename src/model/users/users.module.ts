import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Users } from "./users"
import { UsersService } from "../../service/users/users.service"
import { UsersController } from "../../controller/users/users.controller"
import { Rooms } from "../rooms/rooms"
import { EnviromentserviceService } from "../../service/enviromentservice/enviromentservice.service"
import Auth from "../../controller/users/auth"

@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms])],
  exports: [TypeOrmModule],
  providers: [UsersService, EnviromentserviceService],
  controllers: [UsersController, Auth]
})
export class UsersModule { }
