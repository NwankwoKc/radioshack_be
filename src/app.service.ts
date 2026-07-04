
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private configservice: ConfigService) { }


  helloworld() {
    return "welcome to radioshack your number 1 audiostreaming app"
  }
}
