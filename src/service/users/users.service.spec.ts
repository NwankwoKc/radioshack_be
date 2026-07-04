import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from '../../model/users/users';
import { Repository } from 'typeorm';
import { Rooms } from '../../model/rooms/rooms';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
type responsedata = {
  username: string,
  id: string,
  email: string,
  isActive: boolean
}


jest.mock('bcrypt')
describe('UsersService', () => {
  const resolvedata = {
    id: 'id',
    username: 'username',
    email: 'nkelechi21@gmail.com',
    groups: [],
    createdgroups: [],
    isActive: true,
    password: 'helloworld !!! luremipsum'
  }

  const resolveduser = {
    id: "id",
    username: "username",
    email: "nkelechi21@gmail.com",
    groups: [],
    createdgroups: [],
    isActive: true
  }

  const resolveroomdata = {
    id: '1234567',
    roomname: 'default name',
    description: 'default description',
    isActive: true,
    creatorid: '1234567',
    members: [],
    creator: resolvedata
  }

  const body = {
    "username": "nwankwokce",
    "password": "12345678",
    "email": "nkelechi23@gmail.com"
  }

  const loginbody = {
    "password": "1234568",
    "email": "nkelechi21@gmail.com"
  }

  let service: UsersService;
  let userRepository: jest.Mocked<Repository<Users>>;
  let roomRepository: jest.Mocked<Repository<Rooms>>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const mockRoomRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(Rooms),
          useValue: mockRoomRepository
        },
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(Users));
    roomRepository = module.get(getRepositoryToken(Rooms));
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createuser', () => {
    it('when create user is successful', async () => {
      const responsedata = {
        username: resolvedata.username,
        id: resolvedata.id,
        email: resolvedata.email,
        isActive: resolvedata.isActive
      }
      const hashimoto = "dosi9s09ds0uud90sd0jjs"
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashimoto))
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({
        ...resolvedata,
        password: hashimoto
      });

      let signup = await service.createuser(body);

      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(body.password, 12);
      expect(signup).toEqual(responsedata);
    });

    it('if user with email already exist', async () => {
      userRepository.findOneBy.mockResolvedValue(resolvedata);

      await expect(service.createuser(body)).rejects.toThrow(
        new ConflictException('User with this email already exists')
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: body.email
      });
    });
  });

  describe('finduser', () => {
    it('when finduser is successful', async () => {
      const id = "111333id";
      let mockedval = { ...resolvedata, password: "anythingpassword" };
      userRepository.findOne.mockResolvedValue(mockedval);

      let getuser = await service.finduser(id);

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(getuser).toEqual(resolveduser);
    });

    it('when user not found', async () => {
      const id = "111333id";
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.finduser(id)).rejects.toThrow(
        new NotFoundException('usernotfound')
      );

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: {
          groups: true,
          createdgroups: true
        }
      });
    });
  });

  describe('remove', () => {
    it('when remove user is successful', async () => {
      let id = "123dkdk";

      await service.remove(id);

      expect(userRepository.delete).toHaveBeenCalled();
      expect(userRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('login', () => {
    it('when login is successful', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      userRepository.findOneBy.mockResolvedValue(resolvedata);

      let login = await service.login(loginbody);

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(loginbody.password, resolvedata.password);
      expect(login).toEqual(resolveduser);
    });

    it('when email does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.login(loginbody)).rejects.toThrow(
        new BadRequestException("email does not exist")
      );

      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginbody.email
      });
    });

    it('when password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      userRepository.findOneBy.mockResolvedValue(resolvedata);

      await expect(service.login(loginbody)).rejects.toThrow(
        new ConflictException("password is incorrect")
      );

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(loginbody.password, resolvedata.password);
    });
  });
});
