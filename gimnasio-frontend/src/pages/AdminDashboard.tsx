import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { usersApi } from '../services/api';

interface Stats {
  total: number;
  admins: number;
  instructors: number;
  members: number;
}

export default function AdminDashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await usersApi.getAll();
        const users = res.data;
        setStats({
          total: users.length,
          admins: users.filter((u) => u.role === 'admin').length,
          instructors: users.filter((u) => u.role === 'instructor').length,
          members: users.filter((u) => u.role === 'member').length,
        });
      } catch {
        setStats({ total: 0, admins: 0, instructors: 0, members: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  const cards = [
    { title: 'Total Usuarios', value: stats?.total ?? 0, icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />, isPrimary: true },
    { title: 'Administradores', value: stats?.admins ?? 0, icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'text.secondary' }} />, isPrimary: false },
    { title: 'Instructores', value: stats?.instructors ?? 0, icon: <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} />, isPrimary: true },
    { title: 'Miembros', value: stats?.members ?? 0, icon: <PersonIcon sx={{ fontSize: 40, color: 'text.secondary' }} />, isPrimary: false },
  ];

  return (
    <Container maxWidth={false} sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h2" sx={{ mb: 4, color: 'text.primary' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, width: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                {card.icon}
                <Typography variant="h3" sx={{ color: card.isPrimary ? 'primary.main' : 'text.secondary' }}>
                  {card.value}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}