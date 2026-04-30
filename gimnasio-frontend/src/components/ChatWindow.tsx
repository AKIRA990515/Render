import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Chip, useTheme, Avatar, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../services/socket';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatWindow() {
  const theme = useTheme();
  const { user } = useAuth();
  const { isConnected, messages, sendMessage } = useSocket();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
    const isOwn = msg.userId === user?.id;
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          mb: 1,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            maxWidth: '70%',
            bgcolor: isOwn ? theme.palette.primary.dark : theme.palette.background.default,
            color: isOwn ? '#fff' : theme.palette.text.primary,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: isOwn ? '#fff' : theme.palette.primary.main,
              }}
            >
              {msg.userName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isOwn ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
                fontSize: '0.65rem',
              }}
            >
              {formatDate(msg.createdAt)}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              color: isOwn ? '#fff' : theme.palette.text.primary,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {msg.content}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Chat Grupal</Typography>
        <Chip
          label={isConnected ? 'Conectado' : 'Desconectado'}
          color={isConnected ? 'success' : 'error'}
          size="small"
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          slotProps={{
            input: { sx: { bgcolor: 'background.default' } },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!isConnected || !input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}