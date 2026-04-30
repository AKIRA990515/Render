import { useEffect } from 'react';
import { Box } from '@mui/material';
import ChatWindow from '../components/ChatWindow';
import ProtectedRoute from '../components/ProtectedRoute';
import { SocketProvider, useSocket } from '../context/SocketContext';

function ChatContent() {
  const { connect, disconnect } = useSocket();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <ChatWindow />
    </Box>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <SocketProvider>
        <ChatContent />
      </SocketProvider>
    </ProtectedRoute>
  );
}