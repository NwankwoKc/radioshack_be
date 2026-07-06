import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from '../service/ws/ws.service';
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;
  socket: Socket;

  constructor(private ws: WsService) { }
  afterInit(server: Server) {
    this.ws.setServer(server)
  }
  handleConnection(client: Socket) {
    this.ws.handleConnection(client)
  }

  handleDisconnect(client: Socket) {
    this.ws.handleDisconnect(client)
  }
  @SubscribeMessage('createroom')
  public createroom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomname: string }) {
    return this.ws.createroom(data.roomname, client)
  }
  @SubscribeMessage('joinroom')
  public joinroom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomname: string }) {
    return this.ws.joinroom(data.roomname, client)
  }

  @SubscribeMessage('send-within-room')
  public handlepublicmessage(
    @MessageBody() data: { from: string, groupname: string, message: string },
    @ConnectedSocket() client: Socket) {
    return this.ws.sendpublicmessage(client, data.groupname, data.message)
  }

  @SubscribeMessage('private-message')
  public handlePrivateMessage(
    @MessageBody() data: { to: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.ws.sendprivatemessage(client, data.to, data.message)
  }
}
