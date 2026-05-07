import { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper, IconButton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, CircularProgress,
  Alert, Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { User, usersApi } from '../services/api';

const alertStyle = {
  mb: 2,
  animation: 'fadeOut 1s 9s forwards',
  '@keyframes fadeOut': {
    '0%': { opacity: 1 },
    '100%': { opacity: 0 },
  }
};

const roles = [
  { value: 'member', label: 'Miembro' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'admin', label: 'Administrador' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{ name: string; email: string; role: 'member' | 'instructor' | 'admin'; password: string }>({ name: '', email: '', role: 'member', password: '' });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch {
      setError('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role as 'member' | 'instructor' | 'admin', password: '' });
    } else {
      setSelectedUser(null);
      setFormData({ name: '', email: '', role: 'member', password: '' });
    }
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id, formData);
      } else {
        await usersApi.create({ ...formData, createdAt: '' } as any);
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error guardando usuario');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await usersApi.delete(selectedUser.id);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      setError('Error eliminando usuario');
    }
  };

  const getRoleChip = (role: string) => {
    const colors = { admin: 'error' as const, instructor: 'warning' as const, member: 'success' as const };
    return <Chip label={roles.find((r) => r.value === role)?.label} color={colors[role as keyof typeof colors]} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ color: 'text.primary' }}>
          Gestión de Usuarios
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Nuevo Usuario
        </Button>
      </Box>

      {error && <Alert severity="error" sx={alertStyle} onClose={() => setError('')}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', overflowX: 'auto', minHeight: 200 }}>
        <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Rol</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ color: 'text.primary' }}>{user.name}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(user)} sx={{ color: 'primary.main' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
          sx={{ color: 'text.primary', bgcolor: 'background.paper', borderRadius: 2, mt: 1 }}
        />

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
            {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'background.paper', pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ mb: 2 }}
              slotProps={{
                input: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mb: 2 }}
              slotProps={{
                input: { sx: { bgcolor: 'background.default' } }
              }}
            />
            <TextField
              select
              fullWidth
              label="Rol"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'instructor' | 'admin' })}
              sx={{ mb: 2 }}
            >
              {roles.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </TextField>
            <TextField
              fullWidth
              label={selectedUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!selectedUser}
              slotProps={{
                input: { sx: { bgcolor: 'background.default' } }
              }}
            />
            {error && <Alert severity="error" sx={alertStyle}>{error}</Alert>}
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.paper' }}>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>¿Eliminar usuario?</DialogTitle>
          <DialogContent sx={{ bgcolor: 'background.paper' }}>
            <Typography sx={{ color: 'text.secondary' }}>Esta acción no se puede deshacer.</Typography>
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.paper' }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
}