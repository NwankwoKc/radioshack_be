import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

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
          "message": [
            'password must be longer than or equal to 6 characters',
            'password must be a string'
          ],
          "error": 'Bad Request',
          "statusCode": 400
        }
        )
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
          "message": ['email must be a string', 'email must be an email'],
          "error": 'Bad Request',
          "statusCode": 400
        }
        )
    })
    it('if password data type is number instead of string', async () => {
      const loginbody = {
        email: "nkelechi23@gmail.com",
        password: 12345678
      }
      return request(app.getHttpServer())
        .post('/auth')
        .send(loginbody)
        .expect(400)
        .expect({
          "message": [
            "password must be longer than or equal to 6 characters",
            "password must be a string"
          ],
          "error": "Bad Request",
          "statusCode": 400
        })
    })

  })

  describe('rooms', () => {

    it("GET /rooms", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      return request(app.getHttpServer())
        .get('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
    })
    it("GET /rooms if user is not authorzed or has not logged in", async () => {
      return request(app.getHttpServer())
        .get('/rooms')
        .set('Authorization', "")
        .expect(401)
        .expect(
          {
            "message": "Unauthorized",
            "statusCode": 401
          }
        )
    })
  })
  afterAll(async () => {
    app.close()
  })
});
