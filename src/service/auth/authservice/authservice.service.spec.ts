import { Test, TestingModule } from '@nestjs/testing';
import { AuthserviceService } from './authservice.service';
import { JwtService } from '@nestjs/jwt';
import { EnviromentserviceService } from '../../../service/enviromentservice/enviromentservice.service';
import { Users } from '../../../model/users/users';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthserviceService', () => {
  let service: AuthserviceService;
  let mockenvservice = {
    jwtsercret: jest.fn().mockReturnValue("secretetoken")
  }
  let mockjwtservice = {
    signAsync: jest.fn().mockReturnValue("token")
  }

  const mockUserRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthserviceService,
        {
          provide: EnviromentserviceService, useValue: mockenvservice
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository
        },

        {
          provide: JwtService, useValue: mockjwtservice
        }],
    }).compile();

    service = module.get<AuthserviceService>(AuthserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
