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
    it("GET /rooms/:id - should return a specific room", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      const roomId = "28368fa3-7093-4770-b307-30bbedb4f755"

      return request(app.getHttpServer())
        .get(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.message).toBe("success")
          expect(res.body.data).toHaveProperty('id')
          expect(res.body.data).toHaveProperty('roomname')
          expect(res.body.data).toHaveProperty('description')
          expect(res.body.data).toHaveProperty('creator')
          expect(res.body.data).toHaveProperty('members')
        })
    })

    it("GET /rooms/:id - should return 404 for non-existent room", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"

      return request(app.getHttpServer())
        .get("/rooms/a3f2c8d7-6b5e-4e1a-9c3d-8f7a2b4e6d1c")
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
        .expect({
          "message": "room not found",
          "statusCode": 404
        })
    })

    it("POST /rooms - should create a new room", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      const newRoom = {
        roomname: "test-rooms",
        description: "A test room for e2e testings",
        creatorId: "223bce21-cc33-4285-a9af-098c19a48ab4"
      }

      return request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newRoom)
        .expect(201)
        .expect(res => {
          expect(res.body.message).toBe("rooom succefully created")
          expect(res.body.data).toHaveProperty('id')
          expect(res.body.data.roomname).toBe(newRoom.roomname)
          expect(res.body.data.description).toBe(newRoom.description)
          expect(res.body.data.isActive).toBeDefined()
        })
    })

    it("POST /rooms - should fail with invalid data", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"

      return request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
          description: "Incomplete room data"
        })
        .expect(400)
        .expect({
          "message": [
            "roomname is required",
            "roomname must be shorter than or equal to 50 characters",
            "roomname must be longer than or equal to 3 characters",
            "roomname must be a string",
            "creatorid is required",
            "creatorId must be a UUID"
          ],
          "error": "Bad Request",
          "statusCode": 400
        })
    })

    it("DELETE /rooms/:id - should delete a room", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      const roomId = "room-to-delete-id" // Replace with a deletable room ID

      return request(app.getHttpServer())
        .delete(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.message).toBe("success")
        })
    })

    it("POST /rooms/joinroom/:id - should allow user to join a room", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      const userId = "048f18bd-14e4-4447-944a-7512c63b7d13"
      const roomName = "radioshack 1.1.1"

      return request(app.getHttpServer())
        .post(`/rooms/joinroom/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ roomname: roomName })
        .expect(201)
        .expect(res => {
          expect(res.body.message).toBe("success")
          expect(res.body.data).toBeDefined()
        })
    })

    it("POST /rooms/joinroom/:id - should fail for non-existent room", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      const userId = "223bce21-cc33-4285-a9af-098c19a48ab4"

      return request(app.getHttpServer())
        .post(`/rooms/joinroom/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ roomname: "non-existent-room" })
        .expect(404)
        .expect(res => {
          expect(res.body.message).toBe("such user or room not found")
        })
    })

    it("POST /rooms/token - should create a livekit token", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"
      const tokenRequest = {
        room_name: "test-room",
        participant_identity: "test-participant"
      }

      return request(app.getHttpServer())
        .post('/rooms/token')
        .set('Authorization', `Bearer ${authToken}`)
        .send(tokenRequest)
        .expect(201)
        .expect(res => {
          expect(res.body.message).toBe("success")
          expect(res.body.data).toBeDefined()
          expect(res.body.data.length).toBeGreaterThan(0)
        })
    })

    it("POST /rooms/token - should fail without required fields", async () => {
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIkMmIkMTIkMVpSeUx2a3N4VTUva1I0M0dhZjF6dU9kQS5SdnJKSEtDQ1d1bC5HRzIzLk9BbkE3TjFrTmEiLCJ1c2VybmFtZSI6Im53YW5rd29rY2UiLCJpYXQiOjE3ODQwMzI1MjYsImV4cCI6NC45MDAwMDAwMDAwMDAwMTg0ZSsyM30.UH3H8-ez3GUoUAkFgneOtbe03JiPLnUzDdPxTNLA6Ng"

      return request(app.getHttpServer())
        .post('/rooms/token')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing room_name
          participant_identity: "test-participant"
        })
        .expect(400)
    })

    it("Should return 401 for all protected routes without auth token", async () => {
      const routes = [
        { method: 'get', path: '/rooms/123' },
        { method: 'post', path: '/rooms' },
        { method: 'delete', path: '/rooms/123' },
        { method: 'post', path: '/rooms/joinroom/123' },
        { method: 'post', path: '/rooms/token' }
      ]

      for (const route of routes) {
        await request(app.getHttpServer())[route.method](route.path)
          .expect(401)
          .expect({
            "message": "Unauthorized",
            "statusCode": 401
          })
      }
    })
  })
  afterAll(async () => {
    app.close()
  })
});
