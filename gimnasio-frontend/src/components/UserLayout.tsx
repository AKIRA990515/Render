import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, Drawer, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 64;

function SidebarContent({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const theme = useTheme();
  const color = theme.palette.primary.main;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate('/user/profile'); onClose(); }}>
            <ListItemIcon sx={{ color }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Mi Perfil" sx={{ color: theme.palette.text.primary }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate('/user/chat'); onClose(); }}>
            <ListItemIcon sx={{ color }}><ChatIcon /></ListItemIcon>
            <ListItemText primary="Chat Grupal" sx={{ color: theme.palette.text.primary }} />
          </ListItemButton>
        </ListItem>
      </List>
      {isAdmin && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={() => { navigate('/admin/dashboard'); onClose(); }}
            sx={{
              bgcolor: theme.palette.error.main,
              '&:hover': { bgcolor: theme.palette.error.dark },
            }}
          >
            Panel de Administración
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <ListItemButton onClick={() => { handleLogout(); onClose(); }}>
          <ListItemIcon sx={{ color: '#f44336' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" sx={{ color: '#f44336' }} />
        </ListItemButton>
      </Box>
    </>
  );
}

export default function UserLayout() {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const color = theme.palette.primary.main;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('profile')) return 'Mi Perfil';
    if (path.includes('chat')) return 'Chat Grupal';
    return 'RoFitness';
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
          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color }}>
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Ir a página principal">
                  <IconButton component="a" href="/" target="_blank" sx={{ color }}>
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
                  <IconButton onClick={toggleTheme} sx={{ color }}>
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ color }}>
                {getPageTitle()}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Ir a página principal">
                  <Button component="a" href="/" target="_blank" startIcon={<OpenInNewIcon />} sx={{ color }}>
                    Ver sitio
                  </Button>
                </Tooltip>
                <Tooltip title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
                  <IconButton onClick={toggleTheme} sx={{ color, '&:hover': { bgcolor: `${color}22` } }}>
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
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
        {/* SIDEBAR - Desktop */}
        {!isMobile && (
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
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </Box>
        )}

        {/* SIDEBAR - Mobile Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: SIDEBAR_WIDTH,
              bgcolor: theme.palette.background.paper,
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <SidebarContent onClose={() => setDrawerOpen(false)} />
        </Drawer>

        {/* MAIN */}
        <Box
          component="main"
          sx={{
            flex: 1,
            height: 'calc(100vh - 128px)',
            p: { xs: 2, md: 3 },
            overflow: 'auto',
            width: { xs: '100%', md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
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
          © 2026 RoFitness. Todos los derechos reservados.
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