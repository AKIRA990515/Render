import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getSocket, disconnectSocket, ChatMessage } from '../services/socket';

interface SocketContextType {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const connect = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const socket = getSocket();
      socket.auth = { token };
      socket.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    setMessages([]);
  }, []);

  const sendMessage = useCallback((content: string) => {
    const socket = getSocket();
    if (socket.connected && content.trim()) {
      socket.emit('message', { content: content.trim() });
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };
    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };
    const onConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
    };

    const onHistory = (history: ChatMessage[]) => {
      console.log('History received:', history.length, 'messages');
      setMessages(history);
    };

    const onMessage = (message: ChatMessage) => {
      console.log('New message received:', message);
      setMessages((prev) => [...prev, message]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('history', onHistory);
    socket.on('message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('history', onHistory);
      socket.off('message', onMessage);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        messages,
        sendMessage,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket debe usarse dentro de SocketProvider');
  return context;
};