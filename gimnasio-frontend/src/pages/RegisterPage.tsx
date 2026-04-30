import { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Alert, Link, useTheme } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err: any) {
      console.error('Error registro:', err);
      setError(err?.response?.data?.message || err?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 3, color: 'primary.main' }}>
            Crear Cuenta
          </Typography>
          {success && (
            <Alert severity="success" sx={{ 
                mb: 2,
                animation: 'fadeOut 1s 9s forwards',
                '@keyframes fadeOut': {
                  '0%': { opacity: 1 },
                  '100%': { opacity: 0 },
                }
              }}>
              ¡Cuenta creada exitosamente! Redirigiendo...
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ 
                mb: 2,
                animation: 'fadeOut 1s 9s forwards',
                '@keyframes fadeOut': {
                  '0%': { opacity: 1 },
                  '100%': { opacity: 0 },
                }
              }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
              slotProps={{
                outline: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              slotProps={{
                outline: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              fullWidth
              label="Teléfono (opcional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
              slotProps={{
                outline: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              slotProps={{
                outline: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              fullWidth
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              slotProps={{
                outline: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </Box>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              ¿Ya tienes cuenta? Inicia sesión
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