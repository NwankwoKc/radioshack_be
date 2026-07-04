import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from 'src/model/users/users';
import { Repository } from 'typeorm';
import { Rooms } from 'src/model/rooms/rooms';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

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

  const resolveduser =
  {
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
    findOneBy: jest.fn().mockResolvedValue(() => Promise.resolve([''])),
    create: jest.fn().mockResolvedValue(() => Promise.resolve(resolvedata)),
    findOne: jest.fn().mockResolvedValue(() => Promise.resolve(resolvedata)),
    delete: jest.fn(),
    save: jest.fn().mockResolvedValue(() => Promise.resolve(resolvedata)),
  };

  const mockRoomRepository = {
    findOne: jest.fn().mockResolvedValue(() => Promise.resolve(resolveroomdata)),
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
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createuser', () => {
    it('when create user is successful', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation((pass: string, salt: number) => Promise.resolve('hashedpassword'))
      userRepository.findOneBy.mockResolvedValue(null)
      userRepository.save.mockResolvedValue(resolvedata)

      let signup = await service.createuser(body)

      expect(userRepository.findOne).toHaveBeenCalled()
      expect(userRepository.save).toHaveBeenCalled()
      expect(bcrypt.hash).toHaveBeenCalled()
      expect(bcrypt.hash).toHaveBeenCalledWith(body.password, 12)
      expect(signup).toEqual(resolveduser)
    })
    it('if user with email already exist', async () => {
      userRepository.findOneBy.mockResolvedValue(resolvedata)

      let signup = await service.createuser(body)
      expect(userRepository).toHaveBeenCalledWith({
        email: body.email
      })
      expect(signup).toThrow(new ConflictException('User with this email already exists'))
    })

  })
  describe('finduser', () => {
    it('when finduser is successful', () => {
      const id = "111333id"
      let mockedval = { ...resolvedata, password: "anythingpassword" }
      userRepository.findOne.mockResolvedValue(mockedval)

      let getuser = service.finduser(id)

      expect(userRepository.findOne).toHaveBeenCalled()
      expect(getuser).toEqual(resolvedata)
    })

    it('when usernot successful', () => {
      const id = "111333id"
      userRepository.findOne.mockResolvedValue(null)

      let getuser = service.finduser(id)
      expect(userRepository.findOne).toHaveBeenCalled()
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: {
          groups: true,
          createdgroups: true
        }
      })
      expect(getuser).toThrow(new NotFoundException('usernotfound')
      )
    })
  })

  describe('remove', () => {
    it('when remove user is successful', () => {
      let id = "123dkdk"
      let remove = service.remove(id)
      expect(userRepository.remove).toHaveBeenCalled()
    })

  })
  describe('login', () => {
    it('when login is successful', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation((bodypassword: string, resolvepassword: string) => true)

      userRepository.findOneBy.mockResolvedValue(resolvedata)

      let login = service.login(loginbody)

      expect(bcrypt.compare).toHaveBeenCalled()
      expect(bcrypt.compare).toHaveBeenCalledWith(loginbody.password, resolvedata.password)
      expect(login).toEqual(resolveduser)
    })

    it('when email does not exist', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation((bodypassword: string, resolvepassword: string) => true)
      userRepository.findOneBy.mockResolvedValue(null)

      let login = service.login(loginbody)

      expect(userRepository.findOne).toHaveBeenCalled()
      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: loginbody.email
      })
      expect(login).toThrow(new BadRequestException("email does not exist"))
    })

    it('when password is incorrect', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation((bodypassword: string, resolvepassword: string) => false)
      userRepository.findOneBy.mockResolvedValue(resolvedata)

      let login = service.login(loginbody)

      expect(bcrypt.compare).toHaveBeenCalled()
      expect(bcrypt.compare).toHaveBeenCalledWith(loginbody.password, resolvedata.password)
      expect(login).toThrow(new ConflictException("password is incorrect")
      )
    })
  })

  describe('joingroup', () => {
    it('when joingroup is successful', () => {
      roomRepository.findOne.mockResolvedValue(resolveroomdata)
      userRepository.findOne.mockResolvedValue(resolvedata)
    })
  })
});
