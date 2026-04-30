import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
  namespace: '/chat',
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    console.log('Chat Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    console.log('Client trying to connect:', client.id);
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      console.log('Token received:', token ? 'yes' : 'no');
      
      if (!token) {
        console.log('No token, disconnecting');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      console.log('JWT payload:', payload);

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        console.log('User not found');
        client.disconnect();
        return;
      }

      client.userId = user.id;
      client.userName = user.name;
      this.connectedUsers.set(client.id, user.id);
      console.log('User connected:', user.name);

      const messages = await this.chatService.getMessages(50);
      client.emit('history', messages.reverse());
    } catch (err) {
      console.error('Connection error:', err);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: CreateMessageDto,
  ) {
    if (!client.userId || !client.userName) {
      return;
    }

    const message = await this.chatService.createMessage(
      client.userId,
      client.userName,
      data,
    );

    this.server.emit('message', message);
  }
}