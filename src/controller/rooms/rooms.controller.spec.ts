import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from '../../service/rooms/rooms.service';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{
        provide: RoomsService, useValue: roomservicemock
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

  it('getrooms', () => {
    const find = jest.spyOn(roomsservice, 'findAll').mockResolvedValue([mockgetallroom])
    const result = controller.getrooms()
    expect(find).toHaveBeenCalled()
    expect(result).toEqual({
      message: 'success',
      mockgetallroom
    })
  })

  it('getroombyid', () => {
    const id = '123'
    let find = jest.spyOn(roomsservice, 'findOne').mockResolvedValue(mockgetallroom)

    let result = controller.getroombyid(id)

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
  it('joinroom', () => {
    const id = '123'
    const body = {
      roomname: 'roomname'
    }
    let join = jest.spyOn(roomsservice, 'joinroom').mockResolvedValue('token')
    let result = controller.joinroom(id, body)

    expect(join).toHaveBeenCalledWith(id, body.roomname)
    expect(result).toEqual({
      message: 'success',
      data: 'token'
    })
  })

  it('createtoken', () => {
    const body = {
      roomname: 'roomname',
      participantid: 'participantid'
    }
    let join = jest.spyOn(roomsservice, 'joinroom').mockResolvedValue('token')
    let result = controller.createtoken(body)

    expect(join).toHaveBeenCalledWith(body.roomname, body.participantid)
    expect(result).toEqual({
      message: 'success',
      data: 'token'
    })
  })
});
