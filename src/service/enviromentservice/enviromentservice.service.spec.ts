import { Test, TestingModule } from '@nestjs/testing';
import { EnviromentserviceService } from './enviromentservice.service';

describe('EnviromentserviceService', () => {
  let service: EnviromentserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnviromentserviceService],
    }).compile();

    service = module.get<EnviromentserviceService>(EnviromentserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
