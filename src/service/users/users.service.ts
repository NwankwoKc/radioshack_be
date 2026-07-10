import { Injectable, ConflictException, BadRequestException, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../model/users/users';
import { Repository } from "typeorm"
import * as bcrypt from 'bcrypt'
import { CreateUserDto, LoginDto } from '../../model/dto/user.dto';
import { Rooms } from "../../model/rooms/rooms"
import { userdetailresponse, userResponse } from '../../utils/types';
import { HttpException } from '@nestjs/common';
import { AuthserviceService } from '../auth/authservice/authservice.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userrepository: Repository<Users>,
    @InjectRepository(Rooms)
    private roomrepository: Repository<Rooms>,
    private authservice: AuthserviceService
  ) { }

  async createuser(body: CreateUserDto): Promise<userResponse> {
    const existingUser = await this.userrepository.findOneBy({ email: body.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const genSalt = 12;
    const hashedpaswd = await bcrypt.hash(body.password, genSalt)
    const bd = {
      ...body,
      password: hashedpaswd
    }
    this.userrepository.create(bd)
    const data = await this.userrepository.save(bd)
    console.log(data)
    const token = await this.authservice.singin(data.username, data.password)
    return {
      username: data.username,
      id: data.id,
      email: data.email,
      isActive: data.isActive,
      token: token.accesstoken
    }
  }

  async getusers() {
    const data = await this.userrepository.find({
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true
      }
    })
    return data
  }

  async finduser(id: string): Promise<userdetailresponse> {
    let data = await this.userrepository.findOne({
      where: { id },
      relations: {
        groups: true,
        createdgroups: true
      }
    })
    if (!data) throw new NotFoundException('usernotfound')
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      groups: data.groups,
      createdgroups: data.createdgroups,
      isActive: data.isActive
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.userrepository.findOneBy({ id })
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND)
    }
    await this.userrepository.delete(id)
  }

  async login(body: LoginDto): Promise<userdetailresponse | null> {
    if (!body.password) throw new HttpException('password field is empty', HttpStatus.BAD_REQUEST)
    const check = await this.userrepository.findOneBy({ email: body.email })
    if (!check) throw new BadRequestException("email does not exist")

    const isPasswordValid = await bcrypt.compare(body.password, check.password)
    if (!isPasswordValid) throw new ConflictException("password is incorrect")
    const token = await this.authservice.singin(check.username, check.password)
    return {
      id: check.id,
      username: check.username,
      email: check.email,
      groups: check.groups,
      createdgroups: check.createdgroups,
      isActive: check.isActive,
      token: token.accesstoken
    }
  }
}
