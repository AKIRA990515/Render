import { AppBar, Toolbar, Box, Button, Container, IconButton, Tooltip, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const theme = useTheme();

  return (
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}