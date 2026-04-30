import { Box, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const menuItems = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
const mainContent = Array.from({ length: 30 }, (_, i) => `Contenido ${i + 1}`);

export default function NuevaPagina() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          left: 0,
          width: '100%',
          bgcolor: '#87CEEB',
        }}
      >
        <Toolbar>
          <Typography variant="h6">
            Header
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          pt: '64px',
          pb: '64px',
          bgcolor: '#006400',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 240,
            height: 'calc(100vh - 128px)',
            bgcolor: '#FFA500',
            overflow: 'auto',
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          component="main"
          sx={{
            flex: 1,
            height: 'calc(100vh - 128px)',
            bgcolor: '#FF0000',
            overflow: 'auto',
            p: 2,
          }}
        >
          {mainContent.map((item) => (
            <Typography key={item} variant="body1" sx={{ mb: 2 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 64,
          bgcolor: '#00FFFF',
          display: 'flex',
          alignItems: 'center',
          px: 3,
        }}
      >
        <Typography variant="h6">
          Footer
        </Typography>
      </Box>
    </Box>
  );
}