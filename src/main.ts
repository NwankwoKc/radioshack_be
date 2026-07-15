import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  })
  const env = app.get(ConfigService)
  const port = env.get<number>('PORT')
  if (port) await app.listen(port, () => {
    console.log(`listening at ${port}`)
  });

}
bootstrap();
