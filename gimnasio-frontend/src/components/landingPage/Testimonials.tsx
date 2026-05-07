import { Box, Container, Grid, Typography, Avatar, Rating, useTheme } from '@mui/material';

const testimonials = [
  {
    name: 'Ana García',
    text: 'He probado muchos gimnasios, pero RoFitness es diferente. Los entrenadores te motivan realmente a dar lo mejor de ti.',
    rating: 5,
    avatar: 'AG',
  },
  {
    name: 'Jorge Pérez',
    text: 'En 6 meses perdí 20 kg. El ambiente es increíble y el equipamiento de primera. Totalmente recomendado.',
    rating: 5,
    avatar: 'JP',
  },
  {
    name: 'Laura Ruiz',
    text: 'Las clases de spinning son brutales pero divertidas. He conocido gente increíble y me siento en forma por primera vez.',
    rating: 5,
    avatar: 'LR',
  },
];

const certifications = ['Certificación ISSA', 'Afiliado FIT', 'Safety Certified', 'Eco Gym'];

export default function Testimonials() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}
        >
          Lo que dicen nuestros miembros
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, color: 'text.secondary' }}
        >
          Historias que nos inspiran a seguir mejorando
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
                  height: '100%',
                }}
              >
                <Rating
                  value={testimonial.rating}
                  readOnly
                  sx={{ color: 'primary.main', mb: 2 }}
                />
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: 'text.primary', fontStyle: 'italic' }}
                >
                  "{testimonial.text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                      mr: 2,
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {testimonial.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>
            Certificaciones y Afiliaciones
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {certifications.map((cert, index) => (
              <Box
                key={index}
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                  {cert}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}