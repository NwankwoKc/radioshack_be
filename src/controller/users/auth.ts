import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "src/service/users/users.service";
import { LoginDto } from "src/model/dto/user.dto";


@Controller('auth')
class Auth {
  constructor(private userservice: UsersService) { }
  @Post()
  async login(@Body() body: LoginDto) {
    const data = await this.userservice.login(body)
    console.log(data)
    return {
      message: "success",
      data
    }
  }
}
export default Auth
