import { Box, Container, Grid, Typography, Button, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const plans = [
  {
    name: 'Básico',
    price: '25',
    features: ['Acceso área de pesas', 'Zona cardio', 'Vestuarios', 'WiFi gratuito'],
  },
  {
    name: 'Premium',
    price: '45',
    badge: 'Más Popular',
    features: [
      'Todo del plan Básico',
      'Clases grupales ilimitadas',
      '1 sesión PT/mes',
      'Sauna incluido',
      'Acceso 24/7',
    ],
  },
  {
    name: 'VIP',
    price: '75',
    features: [
      'Todo del plan Premium',
      '4 sesiones PT/mes',
      'Plan nutricional',
      'App de seguimiento',
      'Towel service',
    ],
  },
];

export default function Pricing() {
  const theme = useTheme();

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}
        >
          Planes y Precios
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}
        >
          Elige el plan que mejor se adapte a tus objetivos
        </Typography>

        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  height: 520,
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    bgcolor: 'primary.main',
                    border: '2px solid primary.main',
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}4D`,
                    '& .planTitle': { color: 'primary.contrastText' },
                    '& .planPrice': { color: 'primary.contrastText' },
                    '& .planFeature': { color: 'primary.contrastText' },
                    '& .planIcon': { color: 'primary.contrastText' },
                    '& .planBadge': {
                      bgcolor: 'background.paper',
                      color: 'primary.main',
                    },
                    '& .planButton': {
                      bgcolor: 'background.paper',
                      color: 'primary.main',
                      borderColor: 'background.paper',
                    },
                  },
                }}
              >
                <Box sx={{ p: 4, pb: 2, textAlign: 'center' }}>
                  {plan.badge && (
                    <Box
                      className="planBadge"
                      sx={{
                        display: 'inline-block',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        mb: 1,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {plan.badge}
                    </Box>
                  )}
                  <Typography
                    className="planTitle"
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {plan.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      mt: 1,
                    }}
                  >
                    <Typography
                      className="planPrice"
                      variant="h2"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      ${plan.price}
                    </Typography>
                    <Typography
                      className="planPrice"
                      variant="body1"
                      sx={{ ml: 1, opacity: 0.7, transition: 'color 0.3s ease' }}
                    >
                      /mes
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 4, flexGrow: 1 }}>
                  {plan.features.map((feature, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <CheckIcon
                        className="planIcon"
                        sx={{
                          mr: 1.5,
                          fontSize: 18,
                          color: 'primary.main',
                          transition: 'color 0.3s ease',
                        }}
                      />
                      <Typography
                        className="planFeature"
                        variant="body2"
                        sx={{ color: 'text.primary', transition: 'color 0.3s ease' }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ p: 4, pt: 2 }}>
                  <Button
                    className="planButton"
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      py: 1.5,
                      transition: 'all 0.3s ease',
                    }}
                    href="#registro"
                  >
                    Comenzar Ahora
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            ¡Promoción de Lanzamiento! 20% OFF en tu primera mensualidad
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}