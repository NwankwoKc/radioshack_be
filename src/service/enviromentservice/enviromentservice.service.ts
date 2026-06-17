import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
@Injectable()
export class EnviromentserviceService {
  constructor(private configservice: ConfigService) { }

  getdatabaseurl(): string | undefined {
    return this.configservice.get<string>('DATABASEURL')
  }
  isproduction(): boolean {
    return this.configservice.get('NODEENV') == 'production';
  }
}
