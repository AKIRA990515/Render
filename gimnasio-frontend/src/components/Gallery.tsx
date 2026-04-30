import { useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import GymIcon from '@mui/icons-material/FitnessCenter';
import CardioIcon from '@mui/icons-material/DirectionsRun';
import ShowerIcon from '@mui/icons-material/Shower';
import pesasImg from '../assets/pesas.jpg';
import cardioImg from '../assets/cardio.jpg';
import vestuariosImg from '../assets/vestuarios.jpg';

const galleryImages = [
  {
    image: pesasImg,
    title: 'Sala de Pesas',
    subtitle: 'Equipamiento de élite',
    description: 'Mancuernas de 1 a 50 kg, máquinas de última generación, rack de sentadilla y área de pesas olímpicas.',
    icon: <GymIcon sx={{ fontSize: 60, color: '#88bf40' }} />,
  },
  {
    image: cardioImg,
    title: 'Zona Cardio',
    subtitle: 'Tecnología interactiva',
    description: 'Cintas de correr, elípticas, bikes y remo con pantallas táctiles y conexión a apps de entrenamiento.',
    icon: <CardioIcon sx={{ fontSize: 60, color: '#88bf40' }} />,
  },
  {
    image: vestuariosImg,
    title: 'Vestuarios Premium',
    subtitle: 'Confort total',
    description: 'Duchas calientes, sauna seco, taquillas personales, secadores y zona de descanso con sofás.',
    icon: <ShowerIcon sx={{ fontSize: 60, color: '#88bf40' }} />,
  },
];

function FlipCard({ item }: { item: typeof galleryImages[0] }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Box
      sx={{
        perspective: '1000px',
        height: 350,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 3,
            overflow: 'hidden',
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 3,
            opacity: isFlipped ? 0 : 1,
            visibility: isFlipped ? 'hidden' : 'visible',
            transition: 'opacity 0.3s, visibility 0.3s',
            pointerEvents: isFlipped ? 'none' : 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(21, 23, 18, 0.9) 0%, rgba(21, 23, 18, 0.3) 50%, rgba(21, 23, 18, 0.1) 100%)',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#88bf40',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {item.subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #282d25 0%, #151712 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            transform: 'rotateY(180deg)',
            border: '2px solid #44503a',
            boxSizing: 'border-box',
            opacity: isFlipped ? 1 : 0,
            visibility: isFlipped ? 'visible' : 'hidden',
            transition: 'opacity 0.3s, visibility 0.3s',
            pointerEvents: isFlipped ? 'auto' : 'none',
          }}
        >
          <Box sx={{ mb: 3 }}>{item.icon}</Box>
          <Typography
            variant="h4"
            sx={{ color: 'white', mb: 1, textAlign: 'center' }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#5f6367', textAlign: 'center', mb: 3 }}
          >
            {item.description}
          </Typography>
          <Box
            sx={{
              px: 3,
              py: 1,
              bgcolor: 'rgba(136, 191, 64, 0.2)',
              borderRadius: 2,
              border: '1px solid #88bf40',
            }}
          >
            <Typography variant="body2" sx={{ color: '#88bf40' }}>
              Pasa el mouse para ver la imagen →
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Gallery() {
  return (
    <Box sx={{ py: 10, bgcolor: '#151712' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, color: 'white' }}
        >
          Conoce nuestras instalaciones
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', mb: 6, color: '#5f6367' }}
        >
          Más de 500m² de espacio diseñado para tu bienestar
        </Typography>
        
        <Grid container spacing={4}>
          {galleryImages.map((item, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <FlipCard item={item} />
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 6,
            textAlign: 'center',
            p: 4,
            bgcolor: '#282d25',
            borderRadius: 3,
          }}
        >
          <Typography variant="h3" sx={{ color: '#88bf40', mb: 2 }}>
            Video de Presentación
          </Typography>
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              bgcolor: '#1a1d18',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#5f6367',
              }}
            >
              Video 30-60 segundos del gimnasio
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
