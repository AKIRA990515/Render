import { Box, Container, TextField, Button, Typography, MenuItem, Grid } from '@mui/material';
import { useState } from 'react';

const objectives = [
  'Pérdida de peso',
  'Ganar músculo',
  'Tonificar',
  'Mejorar resistencia',
  'Rehabilitación',
  'Otro',
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    objective: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `¡Hola! Me gustaría reservar mi prueba gratis en RoFitness.\n\nNombre: ${formData.name}\nTeléfono: ${formData.phone}\nEmail: ${formData.email}\nObjetivo: ${formData.objective}`;
    const whatsappUrl = `https://wa.me/5351234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box
      id="registro"
      sx={{
        py: 10,
        bgcolor: '#151712',
        background: 'linear-gradient(180deg, #151712 0%, #282d25 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: '#282d25',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <Typography
            variant="h2"
            sx={{ textAlign: 'center', mb: 2, color: 'white' }}
          >
            ¡Comienza tu transformación!
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', mb: 4, color: '#88bf40', fontWeight: 'bold' }}
          >
            7 días de prueba GRATIS — Sin compromiso
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#151712',
                      '& fieldset': { borderColor: '#44503a' },
                      '&:hover fieldset': { borderColor: '#88bf40' },
                    },
                    '& .MuiInputLabel-root': { color: '#5f6367' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#151712',
                      '& fieldset': { borderColor: '#44503a' },
                      '&:hover fieldset': { borderColor: '#88bf40' },
                    },
                    '& .MuiInputLabel-root': { color: '#5f6367' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
                      bgcolor: '#151712',
                      '& fieldset': { borderColor: '#44503a' },
                      '&:hover fieldset': { borderColor: '#88bf40' },
                    },
                    '& .MuiInputLabel-root': { color: '#5f6367' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  select
                  label="Tu objetivo principal"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#151712',
                      '& fieldset': { borderColor: '#44503a' },
                      '&:hover fieldset': { borderColor: '#88bf40' },
                    },
                    '& .MuiInputLabel-root': { color: '#5f6367' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                    '& .MuiSelect-select': { color: 'white' },
                    '& .MuiMenuItem-root': { bgcolor: '#151712', color: 'white' },
                    '& .MuiMenuItem-root:hover': { bgcolor: '#282d25' },
                    '& .MuiMenuItem-root.Mui-selected': { bgcolor: '#44503a' },
                  }}
                >
                  {objectives.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 2,
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 20px rgba(136, 191, 64, 0.4)',
                  }}
                >
                  Quiero mi prueba gratis
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography
            variant="body2"
            sx={{ textAlign: 'center', mt: 3, color: '#5f6367' }}
          >
            También puedes escribirnos directamente por{' '}
            <a
              href="https://wa.me/5351234567"
              style={{ color: '#88bf40', textDecoration: 'none' }}
            >
              WhatsApp
            </a>{' '}
            o llamar al{' '}
            <a
              href="tel:+5351234567"
              style={{ color: '#88bf40', textDecoration: 'none' }}
            >
              +53 5123 4567
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
