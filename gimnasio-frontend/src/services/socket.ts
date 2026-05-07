import { io, Socket } from 'socket.io-client';

const isProduction = import.meta.env.PROD;
const API_URL = isProduction 
  ? (import.meta.env.VITE_API_URL_PROD || 'https://rofitness-backend.onrender.com')
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

console.log('[SOCKET] Modo:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('[SOCKET] Backend URL:', API_URL);

let socketInstance: Socket | null = null;

function getTokens() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
}

export function getSocket(): Socket {
  const { accessToken, refreshToken } = getTokens();
  
  console.log('[SOCKET] ═══════════════════════════════════════');
  console.log('[SOCKET] 🔌 Solicitando socket...');
  console.log('[SOCKET]   - accessToken:', accessToken ? 'PRESENTE (' + accessToken.substring(0, 25) + '...)' : 'NO');
  console.log('[SOCKET]   - refreshToken:', refreshToken ? 'PRESENTE (' + refreshToken.substring(0, 25) + '...)' : 'NO');

  if (!socketInstance) {
    console.log('[SOCKET] 📝 Creando nueva instancia socket...');
    
    socketInstance = io(`${API_URL}/chat`, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: accessToken,
        refreshToken: refreshToken,
      },
    });

    socketInstance.on('connect', () => {
      console.log('[SOCKET] ✅ CONECTADO al servidor de chat');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[SOCKET] ❌ DESCONECTADO:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[SOCKET] ❌ ERROR DE CONEXIÓN:', error.message);
    });

    socketInstance.on('tokensRefreshed', (tokens: { accessToken: string; refreshToken: string }) => {
      console.log('[SOCKET] 🔄 TOKENS RECIBIDOS DEL SERVIDOR:');
      console.log('[SOCKET]   - accessToken:', tokens.accessToken.substring(0, 30) + '...');
      console.log('[SOCKET]   - refreshToken:', tokens.refreshToken.substring(0, 30) + '...');
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      console.log('[SOCKET] 💾 Tokens guardados en localStorage');
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('[SOCKET] 🔄 RECONEXIÓN (intento #' + attemptNumber + ')');
      const { accessToken: newAccess, refreshToken: newRefresh } = getTokens();
      (socketInstance as any).auth = { token: newAccess, refreshToken: newRefresh };
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log('[SOCKET] 🔄 Intentando reconectar (#' + attemptNumber + ')');
      const { accessToken: newAccess, refreshToken: newRefresh } = getTokens();
      console.log('[SOCKET]   - Nuevo accessToken:', newAccess ? 'presente' : 'NO');
      console.log('[SOCKET]   - Nuevo refreshToken:', newRefresh ? 'presente' : 'NO');
      (socketInstance as any).auth = { token: newAccess, refreshToken: newRefresh };
    });
  }

  (socketInstance as any).auth = { token: accessToken, refreshToken: refreshToken };
  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}