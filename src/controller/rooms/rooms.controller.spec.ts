import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from '../../service/rooms/rooms.service';
import { JwtService } from '@nestjs/jwt';

describe('RoomsController', () => {
  let controller: RoomsController;
  let roomsservice: RoomsService;
  let roomservicemock = {
    createroom: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    joinroom: jest.fn(),
    remove: jest.fn(),
    createtoken: jest.fn()
  }
  const resolvedata = {
    id: 'creator-id',
    username: 'username',
    email: 'nkelechi21@gmail.com',
    groups: [],
    createdgroups: [],
    isActive: true,
    password: 'helloworld !!! luremipsum',
  };
  let mockgetallroom = {
    id: 'id',
    roomname: 'roomname',
    description: 'desciption',
    isActive: true,
    creatorid: 'creatorid',
    members: [],
    creator: resolvedata
  }
  const mockjwtservice = {
    verifyAsync: jest.fn().mockImplementation((data: string) => {
      return {
        name: "name",
        email: "email"
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{
        provide: RoomsService, useValue: roomservicemock,
      },
      {
        provide: JwtService, useValue: mockjwtservice
      }]
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    roomsservice = module.get<RoomsService>(RoomsService)
  });
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getrooms', async () => {
    const find = jest.spyOn(roomsservice, 'findAll').mockResolvedValue([mockgetallroom])
    const result = await controller.getrooms()
    expect(find).toHaveBeenCalled()
    expect(result).toEqual({
      message: 'sucess',
      data: [{
        id: 'id',
        roomname: 'roomname',
        description: 'desciption',
        isActive: true,
        creatorid: 'creatorid',
        members: [],
        creator: resolvedata

      }]
    })
  })

  it('getroombyid', async () => {
    const id = '123'
    let find = jest.spyOn(roomsservice, 'findOne').mockResolvedValue(mockgetallroom)

    let result = await controller.getroombyid(id)

    expect(find).toHaveBeenCalled()
    expect(find).toHaveBeenCalledWith(id)
    expect(result).toEqual({
      message: 'success',
      data: mockgetallroom
    })
  })

  it('deleteroom', () => {
    const id = '123'
    let del = jest.spyOn(roomsservice, 'remove')

    let result = controller.deleteroom(id)
    expect(del).toHaveBeenCalled()
    expect(del).toHaveBeenCalledWith(id)

    expect(result).toEqual({
      message: 'success'
    })
  })
  it('joinroom', async () => {
    const id = '123'
    const body = {
      roomname: 'roomname'
    }
    let join = jest.spyOn(roomsservice, 'joinroom').mockResolvedValue('token')
    let result = await controller.joinroom(id, body)

    expect(join).toHaveBeenCalledWith(id, body.roomname)
    expect(result).toEqual({
      message: 'success',
      data: 'token'
    })
  })

  it('createtoken', async () => {
    const body = {
      room_name: 'roomname',
      participant_identity: 'participantid'
    }
    let join = jest.spyOn(roomsservice, 'createtoken').mockResolvedValue('token')
    let result = await controller.createtoken(body)

    expect(join).toHaveBeenCalledWith(body.room_name, body.participant_identity)
    expect(result).toEqual({
      message: 'success',
      data: 'token'
    })
  })
});
