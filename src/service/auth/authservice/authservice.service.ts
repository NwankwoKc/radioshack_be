import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Users } from 'src/model/users/users';
import { InjectRepository } from '@nestjs/typeorm';
import { EnviromentserviceService } from 'src/service/enviromentservice/enviromentservice.service';

@Injectable()
export class AuthserviceService {
  constructor(
    @InjectRepository(Users)
    private userrepository: Repository<Users>,
    private jwtService: JwtService,
    private envservice: EnviromentserviceService
  ) { }


  async singin(username: string, pass: string): Promise<{ accesstoken: string }> {
    const user = await this.userrepository.findOne({
      where: {
        username
      }
    })
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.password, username: user.username };
    return {
      accesstoken: await this.jwtService.signAsync(payload),
    };
  }

  jwtConstants() {
    return this.envservice.jwtsecrete()
  }
}

