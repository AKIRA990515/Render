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
import { AuthService } from '../auth/auth.service';

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
    private readonly authService: AuthService,
  ) {}

  afterInit() {
    console.log('Chat Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    console.log('[SOCKET] ═══════════════════════════════════════');
    console.log('[SOCKET] Client trying to connect:', client.id);
    
    const accessToken = client.handshake.auth?.token || client.handshake.query?.token as string;
    const refreshToken = client.handshake.auth?.refreshToken || client.handshake.query?.refreshToken as string;
    
    console.log('[SOCKET] Auth object:', JSON.stringify(client.handshake.auth));
    console.log('[SOCKET] Access token received:', accessToken ? 'yes - ' + accessToken.substring(0, 20) + '...' : 'no');
    console.log('[SOCKET] Refresh token received:', refreshToken ? 'yes - ' + refreshToken.substring(0, 20) + '...' : 'no');
    
    if (!accessToken) {
      console.log('[SOCKET] ❌ No access token, disconnecting');
      client.disconnect();
      return;
    }

    try {
      console.log('[SOCKET] 🔐 Verificando access token...');
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      console.log('[SOCKET] ✅ Access token válido. JWT payload:', payload);

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        console.log('[SOCKET] ❌ User not found in database');
        client.disconnect();
        return;
      }

      client.userId = user.id;
      client.userName = user.name;
      this.connectedUsers.set(client.id, user.id);
      console.log('[SOCKET] ✅ User connected:', user.name);

      const messages = await this.chatService.getMessages(50);
      client.emit('history', messages.reverse());
      console.log('[SOCKET] ═══════════════════════════════════════');
    } catch (err: any) {
      console.error('[SOCKET] ❌ Connection error:', err.message || err.name);
      console.log('[SOCKET] Error type:', err.name);
      
      if (err.name === 'TokenExpiredError') {
        console.log('[SOCKET] ⏰ Access token expirado!');
        
        if (!refreshToken) {
          console.log('[SOCKET] ❌ No refresh token disponible, desconectando');
          client.disconnect();
          return;
        }
        
        console.log('[SOCKET] 🔄 Intentando refresh token...');
        
        try {
          console.log('[SOCKET] 📡 Llamando a authService.refreshTokens()...');
          const tokens = await this.authService.refreshTokens(refreshToken);
          console.log('[SOCKET] ✅ Refresh exitoso!');
          console.log('[SOCKET]   - Nuevo accessToken:', tokens.accessToken.substring(0, 30) + '...');
          console.log('[SOCKET]   - Nuevo refreshToken:', tokens.refreshToken.substring(0, 30) + '...');
          
          // Emitir nuevos tokens al cliente
          client.emit('tokensRefreshed', {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });
          console.log('[SOCKET] 📤 Tokens emitidos al cliente');
          
          // Verificar el nuevo access token
          const payload = this.jwtService.verify(tokens.accessToken, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          });
          console.log('[SOCKET] 🔐 Nuevo access token verificado. Payload:', payload);

          const user = await this.usersService.findOne(payload.sub);
          if (!user) {
            console.log('[SOCKET] ❌ User not found after refresh');
            client.disconnect();
            return;
          }

          client.userId = user.id;
          client.userName = user.name;
          this.connectedUsers.set(client.id, user.id);
          console.log('[SOCKET] ✅ User connected after refresh:', user.name);

          const messages = await this.chatService.getMessages(50);
          client.emit('history', messages.reverse());
          console.log('[SOCKET] ═══════════════════════════════════════');
        } catch (refreshErr: any) {
          console.error('[SOCKET] ❌ Refresh fallido:', refreshErr.message || refreshErr.name);
          console.log('[SOCKET] 💀 Desconectando cliente por refresh fallido');
          client.disconnect();
        }
      } else {
        console.log('[SOCKET] ❌ Error no manejado o sin refresh token');
        client.disconnect();
      }
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