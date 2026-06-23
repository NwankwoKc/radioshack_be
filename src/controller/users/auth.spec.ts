import { Test, TestingModule } from '@nestjs/testing';
import Auth from './auth';
import { UsersService } from 'src/service/users/users.service';

describe('RoomsController', () => {
  let controller: Auth;
  let userservice: UsersService;
  let userservicemock = {
    login: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Auth],
      providers: [{
        provide: UsersService, useValue: userservicemock
      }]
    }).compile();

    controller = module.get<Auth>(Auth);
    userservice = module.get<UsersService>(UsersService)
  });
  afterEach(() => {
    jest.clearAllMocks()
  })


  it('login', () => {
    const body = {
      email: 'email',
      password: 'password'
    }
    const mockedresponse = {
      id: 'id',
      username: 'username',
      email: 'email',
      groups: [],
      createdgroups: [''],
      isActive: true

    }

    const data = jest.spyOn(userservice, 'login').mockResolvedValue(mockedresponse)
    const login = controller.login(body)
    expect(data).toHaveBeenCalled()
    expect(data).toHaveBeenCalledWith(body)
    expect(login).toEqual({
      message: 'success',
      data: mockedresponse
    })
  })
})
