import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@Injectable()
export class WsService {
  server: Server

  setServer(server: Server) {
    this.server = server
  }
  createroom(roomname: string, socket: Socket) {

    socket.join(roomname)
    this.sendpublicmessage(socket, roomname, "you created a room")
    console.log("room has been created")
    return {
      event: 'success',
      data: 'room has been created'
    }
  }
  joinroom(roomname: string, socket: Socket) {

    socket.join(roomname)
    this.sendpublicmessage(socket, roomname, `${socket.id} joined the room`)
    return {
      event: 'success',
      data: 'user has been added to room'
    }
  }
  sendprivatemessage(socket: Socket, id: string, message: string) {
    socket.emit("private message", {
      from: socket.id,
      to: id,
      message,
      timestamp: Date.now()
    })
    return {
      event: 'success',
      message: 'message sent successfully'
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    this.server.emit('user-left', {
      message: `User ${client.id} left the chat`,
      clientId: client.id,
    });
  }
  sendpublicmessage(socket: Socket, roomname: string, message: string) {
    socket.to(roomname).emit('message', {
      message,
      from: socket.id
    })
    return {
      event: 'success',
      data: 'message sent successfully'
    }
  }
 }
