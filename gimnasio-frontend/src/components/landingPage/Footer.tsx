import { Box, Container, Typography, IconButton, Grid, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import logo from '../../assets/logo.png';

const socialLinks = [
  { icon: <FacebookIcon />, url: 'https://facebook.com/rofitness', label: 'Facebook' },
  { icon: <InstagramIcon />, url: 'https://instagram.com/rofitness', label: 'Instagram' },
  { icon: <WhatsAppIcon />, url: 'https://wa.me/5351234567', label: 'WhatsApp' },
];

export default function Footer() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 3, md: 4 }, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src={logo}
              alt="RoFitness Logo"
              sx={{ height: { xs: 30, md: 40 }, width: 'auto' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              © 2024 RoFitness Santiago de Cuba. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 1 }}>
              {socialLinks.map((link, index) => (
                <IconButton
                  key={index}
                  href={link.url}
                  target="_blank"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', bgcolor: `${theme.palette.primary.main}1A` },
                  }}
                  aria-label={link.label}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}