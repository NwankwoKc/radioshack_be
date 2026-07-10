import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EnviromentserviceService } from "../../../service/enviromentservice/enviromentservice.service"
import { AuthserviceService } from "../authservice/authservice.service"
import { JwtModule } from "@nestjs/jwt"
import { AuthGuard } from "./auth.guard"
import { SharedModule } from "../../../model/users/users.shared.module"
@Module({
  imports: [SharedModule,
    JwtModule.register({
      global: true,
      secret: "Abarakdabara",
      signOptions: { expiresIn: '490000000000000000000000s' }
    })],
  exports: [AuthserviceService, AuthGuard],
  providers: [EnviromentserviceService, AuthserviceService, AuthGuard],
  controllers: []
})
export class Authmodule { }
