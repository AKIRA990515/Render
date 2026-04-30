import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 64;

const useColor = (isAdmin: boolean, isDark: boolean) => {
  if (isAdmin) {
    return isDark ? '#EF4444' : '#DC2626';
  }
  return isDark ? '#4ADE80' : '#16A34A';
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const theme = useTheme();

  const color = useColor(true, isDark);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{
          left: 0,
          width: '100%',
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color }}>
            Panel de Administración
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Ir a página principal">
              <Button
                component="a"
                href="/"
                target="_blank"
                startIcon={<OpenInNewIcon />}
                sx={{ color }}
              >
                Ver sitio
              </Button>
            </Tooltip>
            <Tooltip title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color,
                  '&:hover': { bgcolor: `${color}22` },
                }}
              >
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* CONTAINER */}
      <Box
        sx={{
          flex: 1,
          pt: `${HEADER_HEIGHT}px`,
          pb: `${FOOTER_HEIGHT}px`,
          bgcolor: theme.palette.background.default,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {/* SIDEBAR */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            height: 'calc(100vh - 128px)',
            flexShrink: 0,
            bgcolor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            overflow: 'auto',
          }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/admin/dashboard')}>
                <ListItemIcon sx={{ color }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: theme.palette.text.primary }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/admin/users')}>
                <ListItemIcon sx={{ color }}><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Usuarios" sx={{ color: theme.palette.text.primary }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => navigate('/user/profile')}
              sx={{ color, borderColor: color }}
            >
              Mi Perfil
            </Button>
          </Box>
          <Box sx={{ mt: 'auto', p: 2 }}>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#f44336' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" sx={{ color: '#f44336' }} />
            </ListItemButton>
          </Box>
        </Box>

        {/* MAIN */}
        <Box
          component="main"
          sx={{
            flex: 1,
            height: 'calc(100vh - 128px)',
            p: 3,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: FOOTER_HEIGHT,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          zIndex: theme.zIndex.drawer,
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          © 2026 RoFitness. Panel de Administración.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Facebook">
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              sx={{ color: theme.palette.text.secondary }}
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Instagram">
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              sx={{ color: theme.palette.text.secondary }}
            >
              <InstagramIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Email">
            <IconButton
              component="a"
              href="mailto:contacto@rofitness.com"
              sx={{ color: theme.palette.text.secondary }}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}