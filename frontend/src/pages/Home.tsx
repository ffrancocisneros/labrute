import { Box, Container, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperBox, FantasyButton } from '../components/UI';
import { useAuth } from '../hooks/useAuth';

// Character decorations
const CharacterLeft = () => (
  <Box
    sx={{
      position: 'absolute',
      left: { xs: -20, md: -80 },
      bottom: 0,
      width: { xs: 100, md: 150 },
      height: { xs: 150, md: 220 },
      backgroundImage: 'url(/images/header/left/01.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom left',
      display: { xs: 'none', sm: 'block' },
      zIndex: 1,
    }}
  />
);

const CharacterRight = () => (
  <Box
    sx={{
      position: 'absolute',
      right: { xs: -20, md: -80 },
      bottom: 0,
      width: { xs: 100, md: 150 },
      height: { xs: 150, md: 220 },
      backgroundImage: 'url(/images/header/right/101.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom right',
      display: { xs: 'none', sm: 'block' },
      zIndex: 1,
    }}
  />
);

const Home = () => {
  const [bruteName, setBruteName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateBrute = (e: React.FormEvent) => {
    e.preventDefault();
    if (bruteName.trim()) {
      if (user) {
        navigate('/dashboard', { state: { newBruteName: bruteName.trim() } });
      } else {
        navigate('/register', { state: { bruteName: bruteName.trim() } });
      }
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          py: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <CharacterLeft />
        <CharacterRight />

        {/* Logo */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'LaBrute, GameFont, arial',
              fontSize: { xs: 48, md: 72 },
              color: '#733d2c',
              textShadow: `
                3px 3px 0 #f6ee90,
                -1px -1px 0 #f6ee90,
                1px -1px 0 #f6ee90,
                -1px 1px 0 #f6ee90,
                4px 4px 0 rgba(0,0,0,0.2)
              `,
              letterSpacing: 4,
              mb: 1,
            }}
          >
            LA BRUTE
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Handwritten, arial',
              fontSize: { xs: 18, md: 24 },
              color: 'rgb(176, 107, 79)',
              mb: 4,
            }}
          >
            ¡Arregla cuentas en la arena!
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4} justifyContent="center">
        {/* Create Brute Section */}
        <Grid item xs={12} md={6}>
          <PaperBox
            sx={{
              textAlign: 'center',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'GameFont, LaBrute, arial',
                color: '#733d2c',
                mb: 3,
              }}
            >
              ¡Crea tu Brute!
            </Typography>

            {/* Brute Preview */}
            <Box
              sx={{
                width: 150,
                height: 200,
                mx: 'auto',
                mb: 3,
                backgroundImage: 'url(/images/creation/noCharacter.webp)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              }}
            />

            <Box component="form" onSubmit={handleCreateBrute}>
              <Typography
                sx={{
                  fontFamily: 'Handwritten, arial',
                  fontSize: 16,
                  color: 'rgb(176, 107, 79)',
                  mb: 2,
                }}
              >
                Elige un nombre épico para tu guerrero:
              </Typography>

              <TextField
                value={bruteName}
                onChange={(e) => setBruteName(e.target.value)}
                placeholder="Nombre del Brute"
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    fontFamily: 'Handwritten, arial',
                    fontSize: 18,
                    '& fieldset': {
                      borderColor: '#725254',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <FantasyButton
                type="submit"
                fantasy="success"
                fullWidth
                disabled={!bruteName.trim()}
              >
                ¡Crear mi Brute!
              </FantasyButton>
            </Box>
          </PaperBox>
        </Grid>

        {/* How to Play Section */}
        <Grid item xs={12} md={6}>
          <PaperBox>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'GameFont, LaBrute, arial',
                color: '#733d2c',
                mb: 3,
                textAlign: 'center',
              }}
            >
              ¿Cómo jugar?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <HowToPlayItem
                title="Crea tu Brute"
                description="Dale un nombre épico a tu guerrero y personaliza su apariencia."
                icon="⚔️"
              />
              <HowToPlayItem
                title="Pelea"
                description="Enfréntate a otros Brutes en combates automáticos llenos de acción."
                icon="🏆"
              />
              <HowToPlayItem
                title="Sube de Nivel"
                description="Gana experiencia, mejora tus estadísticas y desbloquea nuevas habilidades."
                icon="📈"
              />
              <HowToPlayItem
                title="Domina la Arena"
                description="Sé el mejor gladiador y presume tu récord de victorias."
                icon="👑"
              />
            </Box>
          </PaperBox>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              title="Combates Épicos"
              description="Peleas automáticas con animaciones fluidas y efectos especiales."
              icon="⚔️"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              title="Habilidades Únicas"
              description="Desbloquea poderes especiales y armas legendarias."
              icon="✨"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              title="Torneos"
              description="Compite contra otros jugadores en torneos diarios."
              icon="🏅"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

// Helper Components
interface HowToPlayItemProps {
  title: string;
  description: string;
  icon: string;
}

const HowToPlayItem = ({ title, description, icon }: HowToPlayItemProps) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#733d2c',
        color: '#f6ee90',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'LaBrute, arial',
        fontSize: 24,
        flexShrink: 0,
        boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        sx={{
          fontFamily: 'GameFont, LaBrute, arial',
          fontSize: 18,
          color: '#733d2c',
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Handwritten, arial',
          fontSize: 14,
          color: 'rgb(176, 107, 79)',
        }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <PaperBox
    variant="accent"
    sx={{
      textAlign: 'center',
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
  >
    <Box
      sx={{
        fontSize: 48,
        mb: 2,
        filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: 'GameFont, LaBrute, arial',
        fontSize: 20,
        color: '#733d2c',
        mb: 1,
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontFamily: 'Handwritten, arial',
        fontSize: 14,
        color: 'rgb(176, 107, 79)',
      }}
    >
      {description}
    </Typography>
  </PaperBox>
);

export default Home;
