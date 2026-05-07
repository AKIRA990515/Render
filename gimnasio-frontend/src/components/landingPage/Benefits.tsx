import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';

const benefits = [
  {
    icon: <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'Entrenadores Certificados',
    description: 'Profesionales titulados que diseñan planes personalizados para tus objetivos.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'Clases Grupales',
    description: 'Spinning, CrossFit, Yoga y más. Socializa mientras te pones en forma.',
  },
];

export default function Benefits() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}
        >
          ¿Por qué elegirnos?
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, color: 'text.secondary' }}
        >
          Todo lo que necesitas para transformar tu cuerpo y tu vida
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
          {benefits.map((benefit, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 3, md: 4 },
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>{benefit.icon}</Box>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
            500m² de bienestar personal
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Disfruta de nuestra sala de pesas con equipamiento de élite, zona de cardio con tecnología interactiva y vestuarios premium con sauna y duchas calientes. Todo diseñado para que tu experiencia de entrenamiento sea única.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}