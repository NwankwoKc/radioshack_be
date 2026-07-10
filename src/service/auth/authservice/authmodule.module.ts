import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Users } from "../../../model/users/users"
import { EnviromentserviceService } from "../../../service/enviromentservice/enviromentservice.service"
import { AuthserviceService } from "../authservice/authservice.service"
import { JwtModule } from "@nestjs/jwt"
import { AuthGuard } from "./auth.guard"
@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  JwtModule.register({
    global: true,
    secret: "Abarakdabara",
    signOptions: { expiresIn: '490000000000000000000000s' }
  })],
  exports: [TypeOrmModule, AuthserviceService, AuthGuard],
  providers: [EnviromentserviceService, AuthserviceService, AuthGuard],
  controllers: []
})
export class Authmodule { }
