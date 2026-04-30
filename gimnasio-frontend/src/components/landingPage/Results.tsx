import { Box, Container, Grid, Typography, Avatar } from '@mui/material';

const results = [
  {
    name: 'Carlos Martínez',
    beforeWeight: '95 kg',
    afterWeight: '78 kg',
    goal: 'Pérdida de grasa',
    duration: '4 meses',
    avatar: 'CM',
  },
  {
    name: 'María López',
    beforeWeight: '62 kg',
    afterWeight: '68 kg',
    goal: 'Ganar músculo',
    duration: '6 meses',
    avatar: 'ML',
  },
  {
    name: 'Roberto Sánchez',
    beforeWeight: '120 kg',
    afterWeight: '95 kg',
    goal: 'Bajar de peso',
    duration: '8 meses',
    avatar: 'RS',
  },
];

export default function Results() {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}
        >
          Resultados de nuestros miembros
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}
        >
          Historias reales de transformación
        </Typography>

        <Grid container spacing={4}>
          {results.map((result, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: 'background.default',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {result.avatar}
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                  {result.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                      {result.beforeWeight}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Antes
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    →
                  </Typography>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>
                      {result.afterWeight}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main' }}>
                      Después
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                  {result.goal}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  En {result.duration}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}