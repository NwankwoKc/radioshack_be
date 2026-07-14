import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 300000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        message: "success",
        data: "welcome to radioshack your number 1 audiostreaming app"
      });
  });

  describe('authentication', () => {


    it('/auth (POST) if login request body does not have property (password)', async () => {
      const loginbody = {
        email: "nkelechi21@gmail.com",
        username: ""
      }
      return request(app.getHttpServer())
        .post('/auth')
        .send(loginbody)
        .expect(400)
        .expect({
          "statusCode": 400,
          "message": "password field is empty"
        })
    })

    it('test if email does not exist', async () => {
      const loginbody = {
        email: "nkelechi21@gmail.com",
        password: "19e0e98e8edjkds"
      }
      return request(app.getHttpServer())
        .post('/auth')
        .send(loginbody)
        .expect(400)
        .expect({
          "statusCode": 400,
          "error": "Bad Request",
          "message": "email does not exist"
        })
    })

    it('what if email property was of data type undefined', async () => {
      const loginbody = {
        password: "19e0e98e8edjkds"
      }
      return request(app.getHttpServer())
        .post('/auth')
        .send(loginbody)
        .expect(400)
        .expect({
          "statusCode": 400,
          "error": "Bad Request",
          "message": "email does not exist"
        })
    })

  })

  afterAll(async () => {
    app.close()
  })
});
