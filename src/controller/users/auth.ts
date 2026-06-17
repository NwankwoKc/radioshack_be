import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "src/service/users/users.service";
import { LoginDto } from "src/model/dto/user.dto";


@Controller('auth')
class Auth {
  constructor(private userservice: UsersService) { }
  @Post()
  login(@Body() body: LoginDto) {
    const data = this.userservice.login(body)

    return {
      message: "success",
      data
    }
  }
}
export default Auth
