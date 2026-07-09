import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './utils/socket';
import { WsService } from './service/ws/ws.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './model/rooms/rooms.module';
import { UsersModule } from './model/users/users.module';
import Auth from './controller/users/auth';
import { UsersService } from './service/users/users.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: "postgresql://postgres.adaviomgajmjkxefeeag:RPBo6peVZrcfzhmX@aws-1-eu-west-2.pooler.supabase.com:6543/postgres",
      synchronize: false,
      logging: true,
      autoLoadEntities: true
    }),
    RoomsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, WsService, UsersService],
})
export class AppModule { }
