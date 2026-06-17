import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Users } from "./users"
import { UsersService } from "src/service/users/users.service"
import { UsersController } from "src/controller/users/users.controller"
import { Rooms } from "../rooms/rooms"
@Module({
  imports: [TypeOrmModule.forFeature([Users, Rooms])],
  exports: [TypeOrmModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
