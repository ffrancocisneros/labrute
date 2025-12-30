import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import {
  SportsMma,
  EmojiEvents,
  TrendingUp,
  Groups,
} from '@mui/icons-material';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: <SportsMma sx={{ fontSize: 48 }} />,
    title: 'Crea tu Brute',
    description: 'Dale un nombre épico a tu guerrero y elige sus habilidades iniciales.',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 48 }} />,
    title: 'Pelea',
    description: 'Enfréntate a otros brutes en combates automáticos llenos de acción.',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48 }} />,
    title: 'Sube de Nivel',
    description: 'Gana experiencia, mejora tus estadísticas y desbloquea nuevas habilidades.',
  },
  {
    icon: <Groups sx={{ fontSize: 48 }} />,
    title: 'Domina la Arena',
    description: 'Sé el mejor gladiador y presume tu récord de victorias.',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4.5rem' },
              mb: 2,
              background: 'linear-gradient(135deg, #d4af37 0%, #f5d77a 50%, #d4af37 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            ⚔️ LaBrute
          </Typography>
          
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ mb: 3, fontFamily: '"Cinzel", serif' }}
          >
            Arena de Gladiadores
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Crea tu guerrero, entrénalo y enfréntate a otros jugadores en épicas batallas por la gloria.
            ¡Demuestra que eres el mejor gladiador de la arena!
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  🏟️ Mi Arena
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/leaderboard')}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  🏆 Ranking
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  ✨ Comenzar Ahora
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  🔑 Ya tengo cuenta
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ mb: 6, color: 'primary.main' }}
        >
          🎮 Cómo Jugar
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.05) 100%)',
        }}
      >
        <Container maxWidth="md">
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary.main">
              ¿Listo para la batalla?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Únete a miles de gladiadores y demuestra tu valía en la arena.
            </Typography>
            {!isAuthenticated && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
              >
                Crear mi Brute Ahora
              </Button>
            )}
          </Card>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;

