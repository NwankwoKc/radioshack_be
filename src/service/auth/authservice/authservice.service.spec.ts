import { Test, TestingModule } from '@nestjs/testing';
import { AuthserviceService } from './authservice.service';

describe('AuthserviceService', () => {
  let service: AuthserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthserviceService],
    }).compile();

    service = module.get<AuthserviceService>(AuthserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
