import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Users } from "./users"
import { UsersService } from "../../service/users/users.service"
import { UsersController } from "../../controller/users/users.controller"
import { Rooms } from "../rooms/rooms"
import { EnviromentserviceService } from "../../service/enviromentservice/enviromentservice.service"
import Auth from "../../controller/users/auth"
import { AuthserviceService } from "../../service/auth/authservice/authservice.service"
import { Authmodule } from "../../service/auth/authservice/authmodule.module"
@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms]), Authmodule],
  exports: [TypeOrmModule],
  providers: [UsersService, EnviromentserviceService, AuthserviceService],
  controllers: [UsersController, Auth]
})
export class UsersModule { }
