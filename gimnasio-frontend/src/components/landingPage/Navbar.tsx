import { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Container, IconButton, Tooltip, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderNavButtons = () => (
    <>
      <Tooltip title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: `${theme.palette.primary.main}22`,
            },
          }}
        >
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
      {isAdmin && (
        <Button
          component={Link}
          to="/admin/dashboard"
          variant="outlined"
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: `${theme.palette.primary.main}22`,
            },
          }}
        >
          Panel Admin
        </Button>
      )}
      {!isAuthenticated && (
        <>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: `${theme.palette.primary.main}22`,
              },
            }}
          >
            Iniciar sesión
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="primary"
            sx={{
              color: theme.palette.getContrastText?.(theme.palette.primary.main) || '#FFFFFF',
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
          >
            Registrarme
          </Button>
        </>
      )}
      {isAuthenticated && (
        <Button
          variant="outlined"
          onClick={logout}
          sx={{
            color: '#f44336',
            borderColor: '#f44336',
          }}
        >
          Cerrar sesión
        </Button>
      )}
    </>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={logo}
                alt="RoFitness Logo"
                sx={{ height: 50, width: 'auto' }}
              />
            </Box>
            {isMobile ? (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {renderNavButtons()}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        Paper={{
          sx: {
            width: '100%',
            maxWidth: 300,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/login"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Iniciar sesión" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/register"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Registrarme" />
            </ListItemButton>
          </ListItem>
          {isAuthenticated && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { logout(); setDrawerOpen(false); }}>
                <ListItemText primary="Cerrar sesión" sx={{ color: '#f44336' }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}