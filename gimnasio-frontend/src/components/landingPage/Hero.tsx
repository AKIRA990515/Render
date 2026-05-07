import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import heroImg from '../../assets/hero.jpg';
import cardioImg from '../../assets/cardio.jpg';
import pesasImg from '../../assets/pesas.jpg';
import vestuariosImg from '../../assets/vestuarios.jpg';
import clasesImg from '../../assets/clases grupales.jpg';
import comunidadImg from '../../assets/comunidad.jpg';

const slides = [
  {
    image: heroImg,
    title: 'Ponte en forma en RoFitness — 7 días de prueba gratis',
    subtitle: 'Entrenadores certificados, equipamiento de última generación y un ambiente que te motiva a superar tus límites.',
    cta: 'Reservar prueba — Cupo limitado',
    showStats: true,
  },
  {
    image: pesasImg,
    title: 'Transforma tu cuerpo con pesas de élite',
    subtitle: 'Mancuernas, máquinas y áreas especializadas para que logres tus metas de fuerza.',
    cta: 'Ver instalaciones',
    showStats: false,
  },
  {
    image: cardioImg,
    title: 'Potencia tu resistencia cardio',
    subtitle: 'Cintas, elípticas y bikes con tecnología de última generación.',
    cta: 'Prueba gratis',
    showStats: false,
  },
  {
    image: clasesImg,
    title: 'Clases grupales para todos los niveles',
    subtitle: 'Spinning, CrossFit, Yoga, Funcional y más. Diviértete mientras quemas calorías.',
    cta: 'Únete a una clase',
    showStats: false,
  },
  {
    image: comunidadImg,
    title: 'Únete a la comunidad RoFitness',
    subtitle: 'Más de 200 miembros activos te esperan. Ambiente motivador y profesionales que te apoyan.',
    cta: 'Ser parte',
    showStats: false,
  },
  {
    image: vestuariosImg,
    title: 'Confort total después de entrenar',
    subtitle: 'Vestuarios premium con sauna, duchas calientes y zona de descanso.',
    cta: 'Visítanos',
    showStats: false,
  },
];

export default function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsTransitioning(false), 800);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [isTransitioning]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', md: '100vh' },
        minHeight: { xs: 500, md: 600 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              minWidth: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(${theme.palette.overlay.main}, ${theme.palette.overlay.light}), url('${slide.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ maxWidth: { xs: 300, md: 700 }, px: { xs: 2, md: 0 } }}>
                <Typography
                  variant="h1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                    textShadow: theme.palette.mode === 'dark'
                      ? '2px 2px 4px rgba(0,0,0,0.5)'
                      : '2px 2px 4px rgba(0,0,0,0.3)',
                    color: 'primary.main',
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: 'primary.dark',
                    textShadow: theme.palette.mode === 'light'
                      ? '1px 1px 2px rgba(255,255,255,0.8)'
                      : 'none',
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href="#registro"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    px: { xs: 3, md: 5 },
                    py: { xs: 1, md: 1.5 },
                    boxShadow: `0 4px 20px ${theme.palette.primary.main}66`,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 6px 25px ${theme.palette.primary.main}80`,
                    },
                  }}
                >
                  {slide.cta}
                </Button>

                {slide.showStats && (
                  <Box sx={{ mt: 4, display: 'flex', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'primary.main' }}>+200</Typography>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'text.secondary' : 'primary.dark',
                        textShadow: theme.palette.mode === 'light' ? '1px 1px 2px rgba(255,255,255,0.8)' : 'none',
                      }}>
                        Miembros activos
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'primary.main' }}>85%</Typography>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'text.secondary' : 'primary.dark',
                        textShadow: theme.palette.mode === 'light' ? '1px 1px 2px rgba(255,255,255,0.8)' : 'none',
                      }}>
                        Tasa de retención
                      </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography variant="h3" sx={{ color: 'primary.main' }}>5★</Typography>
                      <Typography variant="body2" sx={{
                        color: theme.palette.mode === 'dark' ? 'text.secondary' : 'primary.dark',
                        textShadow: theme.palette.mode === 'light' ? '1px 1px 2px rgba(255,255,255,0.8)' : 'none',
                      }}>
                        Valoración Google
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Container>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 800);
              }
            }}
            sx={{
              width: currentSlide === index ? 32 : 12,
              height: 12,
              borderRadius: 6,
              bgcolor: currentSlide === index ? 'primary.main' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: currentSlide === index ? 'primary.main' : 'rgba(255,255,255,0.7)',
              },
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Button
          onClick={handlePrev}
          sx={{
            bgcolor: `${theme.palette.background.paper}99`,
            color: 'text.primary',
            minWidth: isMobile ? 30 : 40,
            height: isMobile ? 50 : 60,
            borderRadius: 0,
            '&:hover': { bgcolor: 'primary.main' },
          }}
        >
          <ArrowBackIosNewIcon />
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Button
          onClick={handleNext}
          sx={{
            bgcolor: `${theme.palette.background.paper}99`,
            color: 'text.primary',
            minWidth: isMobile ? 30 : 40,
            height: isMobile ? 50 : 60,
            borderRadius: 0,
            '&:hover': { bgcolor: 'primary.main' },
          }}
        >
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
}