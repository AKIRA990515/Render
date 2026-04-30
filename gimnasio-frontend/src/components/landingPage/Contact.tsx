import { Box, Container, Grid, TextField, Button, Typography, MenuItem, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const contactInfo = [
  {
    icon: <LocationOnIcon sx={{ color: 'primary.main' }} />,
    title: 'Dirección',
    text: 'Reparto Sorribe, Santiago de Cuba',
  },
  {
    icon: <PhoneIcon sx={{ color: 'primary.main' }} />,
    title: 'Teléfono',
    text: '+53 5 123 4567',
  },
  {
    icon: <AccessTimeIcon sx={{ color: 'primary.main' }} />,
    title: 'Horario Recepción',
    text: 'Lun-Vie: 6am-10pm, Sáb-Dom: 7am-8pm',
  },
];

export default function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `¡Hola! Me gustaría obtener más información.\n\nNombre: ${formData.name}\nEmail: ${formData.email}\nMensaje: ${formData.message}`;
    const whatsappUrl = `https://wa.me/5351234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}
        >
          Contáctanos
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}
        >
          Visítanos en Reparto Sorribe, Santiago de Cuba
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                bgcolor: 'background.default',
                borderRadius: 4,
                p: { xs: 4, md: 5 },
                height: '100%',
              }}
            >
              <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
                ¿Tienes preguntas?
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
                Escríbenos y te responderemos lo antes posible
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.paper',
                          '& fieldset': { borderColor: 'divider' },
                          '&:hover fieldset': { borderColor: 'primary.main' },
                        },
                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                        '& .MuiOutlinedInput-input': { color: 'text.primary' },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      type="email"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.paper',
                          '& fieldset': { borderColor: 'divider' },
                          '&:hover fieldset': { borderColor: 'primary.main' },
                        },
                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                        '& .MuiOutlinedInput-input': { color: 'text.primary' },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Mensaje"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.paper',
                          '& fieldset': { borderColor: 'divider' },
                          '&:hover fieldset': { borderColor: 'primary.main' },
                        },
                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                        '& .MuiOutlinedInput-input': { color: 'text.primary' },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      Enviar mensaje
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', textAlign: 'center' }}>
                También puedes escribirnos directamente por{' '}
                <a href="https://wa.me/5351234567" style={{ color: 'primary.main', textDecoration: 'none' }}>
                  WhatsApp
                </a>
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ height: 250, bgcolor: 'background.default', borderRadius: 3, overflow: 'hidden' }}>
                <iframe
                  title="Ubicación del gimnasio"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d372.123456789!2d-75.8206452!3d20.0295242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDAxJzQ2LjMiTiA3NcKwNDknMTQuMyJX!5e1!3m2!1ses!2scu!4v1712345678901"
                />
              </Box>
              <Box sx={{ bgcolor: 'background.default', borderRadius: 3, p: 3 }}>
                <List>
                  {contactInfo.map((item, index) => (
                    <ListItem key={index} sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={item.text}
                        slotProps={{
                          primary: { sx: { color: 'text.primary', fontWeight: 'bold' } },
                          secondary: { sx: { color: 'text.secondary' } }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}