import { useState, useRef, useEffect } from 'react';
import { Box, Container, Paper, Typography, Avatar, Chip, Button, TextField, IconButton, useTheme, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext';
import { usersApi, authApi } from '../services/api';

export default function ProfilePage() {
  const theme = useTheme();
  const { user, isAdmin, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrador', color: 'error' as const };
      case 'instructor':
        return { label: 'Instructor', color: 'warning' as const };
      case 'member':
        return { label: 'Miembro', color: 'success' as const };
      default:
        return { label: role, color: 'default' as const };
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen debe ser menor a 2MB');
      return;
    }

    setSavingAvatar(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await usersApi.update(user!.id, { avatar: base64 });
        const updatedUser = { ...user, avatar: base64 };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess('Avatar actualizado correctamente');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al actualizar el avatar');
      } finally {
        setSavingAvatar(false);
      }
    };
    reader.onerror = () => {
      setError('Error al leer la imagen');
      setSavingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSavingProfile(true);
    setError('');
    setSuccess('');

    try {
      const res = await usersApi.update(user!.id, {
        name: formData.name,
        phone: formData.phone || undefined,
      });
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggleActive = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newStatus = !user?.isActive;
      const res = await usersApi.update(user!.id, { isActive: newStatus });
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess(newStatus ? 'Usuario activado' : 'Usuario desactivado');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cambiar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSavingPassword(true);
    setError('');
    setSuccess('');

    try {
      await usersApi.changePassword(user!.id, passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Contraseña actualizada correctamente');
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  const roleInfo = getRoleLabel(user.role);

  return (
    <Container maxWidth={false} sx={{ width: '100%', maxWidth: 900, height: '100%' }}>
      <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, width: '100%' }}>
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
          <Avatar
            src={user.avatar}
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              bgcolor: theme.palette.primary.main,
              fontSize: '3rem',
            }}
          >
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          {isEditing && (
            <>
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 'calc(50% - 60px)',
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  '&:hover': { bgcolor: theme.palette.primary.dark },
                }}
                disabled={savingAvatar}
              >
                {savingAvatar ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            {user.name}
          </Typography>
          {!isEditing && (
            <IconButton onClick={() => setIsEditing(true)} sx={{ color: theme.palette.primary.main }}>
              <EditIcon />
            </IconButton>
          )}
        </Box>

        <Chip label={roleInfo.label} color={roleInfo.color} sx={{ mb: 4 }} />

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
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              animation: 'fadeOut 1s 9s forwards',
              '@keyframes fadeOut': {
                '0%': { opacity: 1 },
                '100%': { opacity: 0 },
              }
            }}
          >
            {success}
          </Alert>
        )}

        <Box sx={{ textAlign: 'left', mt: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1 }}>
            Información Personal
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <EmailIcon sx={{ color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Correo electrónico
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PhoneIcon sx={{ color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Teléfono
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Teléfono (opcional)"
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {user.phone || 'No registrado'}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PersonIcon sx={{ color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Nombre completo
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {user.name}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1, mt: 4 }}>
            Estado de la Cuenta
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {user.isActive ? (
              <CheckCircleIcon sx={{ color: 'success.main' }} />
            ) : (
              <CancelPresentationIcon sx={{ color: 'error.main' }} />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ color: user.isActive ? 'success.main' : 'error.main', fontWeight: 600 }}>
                {user.isActive ? 'Cuenta Activa' : 'Cuenta Inactiva'}
              </Typography>
            </Box>
            {isAdmin && (
              <Button
                variant={user.isActive ? 'outlined' : 'contained'}
                color={user.isActive ? 'error' : 'success'}
                onClick={handleToggleActive}
                disabled={loading}
                size="small"
              >
                {loading ? <CircularProgress size={20} /> : user.isActive ? 'Desactivar' : 'Activar'}
              </Button>
            )}
          </Box>

          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1, mt: 4 }}>
            Seguridad
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <LockIcon sx={{ color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Contraseña
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ••••••••
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LockIcon />}
              onClick={() => setPasswordDialogOpen(true)}
              sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
            >
              Cambiar
            </Button>
          </Box>

          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1, mt: 4 }}>
            Fechas
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Fecha de registro
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <UpdateIcon sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Última actualización
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BadgeIcon sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                ID de usuario
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {user.id}
              </Typography>
            </Box>
          </Box>
        </Box>

        {isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditing(false);
                setFormData({ name: user.name, phone: user.phone || '' });
              }}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={savingProfile}
              startIcon={<SaveIcon />}
            >
              {savingProfile ? <CircularProgress size={20} /> : 'Guardar'}
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'background.paper' }}>
          Cambiar Contraseña
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.paper', pt: 2 }}>
          <TextField
            fullWidth
            label="Contraseña actual"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nueva contraseña"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Mínimo 6 caracteres"
          />
          <TextField
            fullWidth
            label="Confirmar nueva contraseña"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'background.paper', p: 2 }}>
          <Button variant="outlined" onClick={() => setPasswordDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={savingPassword}
            startIcon={<LockIcon />}
          >
            {savingPassword ? <CircularProgress size={20} /> : 'Cambiar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}