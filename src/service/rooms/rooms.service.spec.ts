import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { Users } from '../../model/users/users';
import { Rooms } from '../../model/rooms/rooms';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from 'livekit-server-sdk';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EnviromentserviceService } from '../enviromentservice/enviromentservice.service';
import { ConfigService } from '@nestjs/config';
// Mock the livekit-server-sdk module
jest.mock('livekit-server-sdk', () => {
  const mockToJwt = jest.fn().mockResolvedValue('test-generated-token');
  const MockAccessToken = jest.fn().mockImplementation((apiKey, secretKey, options?) => {
    return {
      addGrant: jest.fn(),
      addSIPGrant: jest.fn(),
      toJwt: mockToJwt,
      identity: options?.identity,
    };
  });
  return { AccessToken: MockAccessToken };
});


describe('RoomsService', () => {
  let service: RoomsService;
  let userRepository: jest.Mocked<Repository<Users>>;
  let roomRepository: jest.Mocked<Repository<Rooms>>;

  // Sample data
  const resolvedata = {
    id: 'creator-id',
    username: 'username',
    email: 'nkelechi21@gmail.com',
    groups: [],
    createdgroups: [],
    isActive: true,
    password: 'helloworld !!! luremipsum',
  };

  const resolveroomdata = {
    id: 'room-1',
    roomname: 'default name',
    description: 'default description',
    isActive: true,
    creatorid: 'creator-id',
    members: [],
    creator: resolvedata,
  };

  const roombody = {
    roomname: 'roomname',
    description: 'description',
    creatorId: 'creator-id',  // used in createroom
  };

  // Mock repositories with correct resolved values (not functions)
  const mockUserRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const mockRoomRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const mockenv = {
    apikey: jest.fn().mockReturnValue('APIcFKT2xPzgpAA'),
    secretekey: jest.fn().mockReturnValue('sTjspHnv47QvDi2o3RnMv13BkRCAkuzGOBeobhr2joB')
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        ConfigService,
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
        { provide: getRepositoryToken(Rooms), useValue: mockRoomRepository },
        { provide: EnviromentserviceService, useValue: mockenv }
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    userRepository = module.get(getRepositoryToken(Users));
    roomRepository = module.get(getRepositoryToken(Rooms));


    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('createroom', () => {
    it('should create a room and return user response', async () => {
      // Mock user lookup
      mockUserRepository.findOne.mockResolvedValue({
        id: resolvedata.id,
        email: resolvedata.email,
        username: resolvedata.username,
        isActive: resolvedata.isActive,
      } as any);

      // Mock room creation and save
      const createdRoom = {
        id: 'new-room-id',
        roomname: roombody.roomname,
        description: roombody.description,
        creator: resolvedata,
      };
      mockRoomRepository.create.mockReturnValue(createdRoom);
      mockRoomRepository.save.mockResolvedValue({
        id: 'new-room-id',
        isActive: true,
        username: resolvedata.username,  // mock the returned username/email (even if entity doesn't normally have them)
        email: resolvedata.email,
      });

      const result = await service.createroom(roombody as any);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: roombody.creatorId },
        select: { id: true, email: true, username: true, isActive: true },
      });
      expect(mockRoomRepository.create).toHaveBeenCalledWith({
        roomname: roombody.roomname,
        description: roombody.description,
        creator: {
          id: resolvedata.id,
          email: resolvedata.email,
          username: resolvedata.username,
          isActive: resolvedata.isActive,
        },
      });
      expect(mockRoomRepository.save).toHaveBeenCalledWith(createdRoom);
      expect(result).toEqual({
        id: 'new-room-id',
        isActive: true,
        username: resolvedata.username,
        email: resolvedata.email,
      });
    });

    it('should throw error if fields is null', () => {

    })
  });

  describe('findAll', () => {
    it('should return all rooms', async () => {
      const roomsArray = [resolveroomdata];
      mockRoomRepository.find.mockResolvedValue(roomsArray);

      const result = await service.findAll();

      expect(mockRoomRepository.find).toHaveBeenCalled();
      expect(result).toEqual(roomsArray);
    });
  });

  describe('findOne', () => {
    const roomData = {
      id: 'room-1',
      roomname: 'test-room',
      description: 'desc',
      isActive: true,
      creator: {
        id: 'creator-id',
        email: 'creator@email.com',
        username: 'creator',
        isActive: true,
      },
      members: [
        {
          id: 'member-1',
          email: 'member@email.com',
          username: 'member',
          isActive: true,
        },
      ],
    };

    it('should return a room with creator and members', async () => {
      mockRoomRepository.findOne.mockResolvedValue(roomData);
      const result = await service.findOne('room-1');

      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'room-1' },
        select: {
          id: true,
          roomname: true,
          description: true,
          isActive: true,
          creator: { id: true, email: true, username: true, isActive: true },
          members: { id: true, email: true, username: true, isActive: true },
        },
        relations: { creator: true, members: true },
      });
      expect(result).toEqual(roomData);
    });
    it('when user is not found', async () => {
      let findrooms = mockRoomRepository.findOne.mockResolvedValue(null)


      await expect(service.findOne('id')
      ).rejects.toThrow(new HttpException('room not found', HttpStatus.NOT_FOUND))
      expect(findrooms).toHaveBeenCalled()
    })
  });

  describe('joinroom', () => {
    it('should add user to room and return a token', async () => {
      const room = { id: 'room-1', roomname: 'test-room' };
      const user = {
        id: 'user-1',
        username: 'member1',
        groups: [],
      };

      mockRoomRepository.findOne.mockResolvedValueOnce(room as any);
      mockUserRepository.findOne.mockResolvedValueOnce({ ...user, groups: [] } as any);
      mockUserRepository.save.mockResolvedValue(undefined);

      const result = await service.joinroom('user-1', 'test-room');

      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { roomname: 'test-room' },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        relations: { groups: true },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      // The AccessToken constructor was called
      expect(AccessToken).toHaveBeenCalledWith(
        'APIcFKT2xPzgpAA',
        'sTjspHnv47QvDi2o3RnMv13BkRCAkuzGOBeobhr2joB',
        expect.objectContaining({ identity: 'test-room' }),
      );
      expect(result).toBe('test-generated-token');
    });

    it('should throw error when user or room is not available', async () => {
      const room = { id: 'room-1', roomname: 'test-room' };

      mockRoomRepository.findOne.mockResolvedValueOnce(room as any);
      mockUserRepository.findOne.mockResolvedValueOnce(null);



      await expect(service.joinroom('user-1', 'test-room')).rejects.toThrow(new HttpException('such user or room not found', HttpStatus.NOT_FOUND))
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { roomname: 'test-room' },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        relations: { groups: true },
      });
    })

    it('should throw error when room is not available', async () => {
      const user = {
        id: 'user-1',
        username: 'member1',
        groups: [],
      };
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      await expect(service.joinroom('user-1', 'test-room')).rejects.toThrow(new HttpException('such user or room not found', HttpStatus.NOT_FOUND))
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { roomname: 'test-room' },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        relations: { groups: true },
      });
    })
  });

  describe('remove', () => {
    it('should remove a room if it exists', async () => {
      const room = { id: 'room-1', creator: resolvedata };
      mockRoomRepository.findOne.mockResolvedValue(room as any);
      mockRoomRepository.remove.mockResolvedValue(room as any);

      await service.remove('room-1');

      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'room-1' },
        relations: { creator: true },
      });
      expect(mockRoomRepository.remove).toHaveBeenCalledWith(room);
    });
  });

  describe('createtoken', () => {
    it('should generate a LiveKit token for a room', async () => {
      const result = await service.createtoken('my-room', 'participant-name');

      expect(AccessToken).toHaveBeenCalledWith(
        'APIcFKT2xPzgpAA',
        'sTjspHnv47QvDi2o3RnMv13BkRCAkuzGOBeobhr2joB',
        { identity: 'participant-name' },
      );
      // The token instance should have had grants added
      const tokenInstance = (AccessToken as jest.Mock).mock.results[0].value;
      expect(tokenInstance.addGrant).toHaveBeenCalledWith({ roomJoin: true, room: 'my-room' });
      expect(tokenInstance.addSIPGrant).toHaveBeenCalledWith({ admin: true, call: true });
      expect(tokenInstance.toJwt).toHaveBeenCalled();
      expect(result).toBe('test-generated-token');
    });
  });
});
