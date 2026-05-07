import { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/user/profile', { replace: true });
    } catch (err: unknown) {
      console.error('Error login:', err);
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as { message?: string })?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 2, md: 0 } }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.paper', borderRadius: 3 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: 'primary.main', fontSize: { xs: '1.5rem', md: '2rem' } }}>
            RoFitness Admin
          </Typography>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                animation: 'fadeOut 1s 9s forwards',
                '@keyframes fadeOut': {
                  '0%': { opacity: 1 },
                  '100%': { opacity: 0 },
                }
              }}
            >
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              slotProps={{
                input: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              slotProps={{
                input: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </Box>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              ¿No tienes cuenta? Regístrate
            </Link>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
              ← Volver al inicio
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}