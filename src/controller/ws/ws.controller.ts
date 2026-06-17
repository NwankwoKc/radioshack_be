import { Body, Controller, Post } from '@nestjs/common';

@Controller('ws')
export class WsController {

  @Post('createroom')
  createroom(@Body() roomdetails: any) {

  }
}
