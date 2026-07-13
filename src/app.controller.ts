import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  getHello() {
    const data = this.appService.helloworld()
    return {
      message: "success",
      data
    }
  }
}
