import { Test, TestingModule } from '@nestjs/testing';
import { EnviromentserviceService } from './enviromentservice.service';
import { ConfigService } from '@nestjs/config';

describe('EnviromentserviceService', () => {
  let service: EnviromentserviceService;
  let configservice: ConfigService;
  const mockconfigmodule = {
    get: jest.fn(),
    set: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnviromentserviceService,
        { provide: ConfigService, useValue: mockconfigmodule }
      ],
    }).compile();

    service = module.get<EnviromentserviceService>(EnviromentserviceService);
    configservice = module.get<ConfigService>(ConfigService)

    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test getting env', () => {
    mockconfigmodule.get.mockReturnValue('databaseurl')
    let result = service.getdatabaseurl()
    expect(result).toBe('databaseurl')
  })
});
