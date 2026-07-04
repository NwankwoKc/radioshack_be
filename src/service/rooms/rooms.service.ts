import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from '../../model/rooms/rooms';
import { Repository } from "typeorm"
import { CreateRoomDto } from 'src/model/dto/room.dto';
import { Users } from '../../model/users/users';
import { UserResponseDto } from 'src/model/dto/user.dto';
import { AccessToken, SIPGrant, VideoGrant } from 'livekit-server-sdk';
import { RoomData } from 'src/utils/types';
import { HttpException } from '@nestjs/common';
import { EnviromentserviceService } from '../enviromentservice/enviromentservice.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    @InjectRepository(Users)
    private usersRpository: Repository<Users>,
    private enviroment: EnviromentserviceService
  ) { }


  async createroom(body: CreateRoomDto): Promise<UserResponseDto> {
    if (body.creatorId == null) {
      throw new HttpException("User is not logged in", HttpStatus.BAD_REQUEST)
    }
    const creator = await this.usersRpository.findOne({
      where: { id: body.creatorId },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true
      }
    })
    let data: any
    if (creator) {
      data = this.roomsRepository.create({
        roomname: body.roomname,
        description: body.description,
        creator
      })
    }

    const save = await this.roomsRepository.save(data)
    console.log(save)
    return {
      id: save.id,
      isActive: save.isActive,
      username: save.username,
      email: save.email
    }
  }

  async findAll(): Promise<Rooms[]> {
    return await this.roomsRepository.find();
  }

  async findOne(id: string): Promise<RoomData> {

    const data = await this.roomsRepository.findOne({
      where: { id },
      select: {
        id: true,
        roomname: true,
        description: true,
        isActive: true,
        creator: {
          id: true,
          email: true,
          username: true,
          isActive: true
        },
        members: {
          id: true,
          email: true,
          username: true,
          isActive: true
        }
      },
      relations: {
        creator: true,
        members: true
      }
    })
    if (data) {
      return data
    } else {

      throw new HttpException('room not found', HttpStatus.NOT_FOUND)
    }
  }
  async joinroom(id: string, roomname: string | undefined): Promise<string> {
    const room = await this.roomsRepository.findOne({
      where: { roomname }
    })

    const user = await this.usersRpository.findOne({
      where: { id },
      relations: { groups: true }
    })
    if (!room || !user) throw new HttpException('such user or room not found', HttpStatus.NOT_FOUND)

    user.groups.some(el => el.roomname == roomname)
    user.groups.push(room)
    await this.usersRpository.save(user)
    const ops = {
      identity: roomname,
      attributes: {
        name: user.username
      }
    }
    const at = new AccessToken(this.enviroment.apikey(), this.enviroment.secretekey(), ops)
    const token = await at.toJwt()
    return token
  }

  async remove(id: string): Promise<void> {
    const room = await this.roomsRepository.findOne({
      where: { id: id }
    })
    console.log(room)
    if (room) await this.roomsRepository.remove(room)
  }
  async createtoken(roomname: string, participantname: string): Promise<string> {

    const roomName = roomname;
    const creatorName = participantname;

    const at = new AccessToken(this.enviroment.apikey(), this.enviroment.secretekey(), {
      identity: creatorName
    });
    const videoGrant: VideoGrant = { roomJoin: true, room: roomName };
    const sipGrant: SIPGrant = { admin: true, call: true };

    at.addGrant(videoGrant);
    at.addSIPGrant(sipGrant)
    console.log(at)
    const token = await at.toJwt();
    console.log(token)
    return token
  }
}
