import { Box, Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaperBox } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useMyBrutes } from '../hooks/useBrute';
import { Brute } from '../types';
import AddIcon from '@mui/icons-material/Add';

const Dashboard = () => {
  const { user } = useAuth();
  const { brutes, loading, error, createBrute } = useMyBrutes();
  const navigate = useNavigate();
  const location = useLocation();
  const [createError, setCreateError] = useState<string | null>(null);

  // Handle new brute creation from Home page
  useEffect(() => {
    const state = location.state as { newBruteName?: string } | null;
    if (state?.newBruteName && user) {
      handleCreateBrute(state.newBruteName);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, user]);

  const handleCreateBrute = async (name: string) => {
    setCreateError(null);
    try {
      const newBrute = await createBrute({ name });
      if (newBrute) {
        navigate(`/brute/${newBrute.id}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error creating brute';
      setCreateError(message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#733d2c' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: 'LaBrute, GameFont, arial',
            fontSize: 42,
            color: '#733d2c',
            textShadow: '2px 2px 0 rgba(255,255,255,0.3)',
          }}
        >
          ¡Hola, {user?.username}!
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Handwritten, arial',
            fontSize: 18,
            color: 'rgb(176, 107, 79)',
          }}
        >
          Estos son tus guerreros
        </Typography>
      </Box>

      {(error || createError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || createError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Brute Cards */}
        {brutes.map((brute: Brute) => (
          <Grid item xs={12} sm={6} md={4} key={brute.id}>
            <BruteCard brute={brute} onClick={() => navigate(`/brute/${brute.id}`)} />
          </Grid>
        ))}

        {/* Create New Brute Card */}
        <Grid item xs={12} sm={6} md={4}>
          <PaperBox
            sx={{
              height: '100%',
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#a9d346',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '2px 3px 0 rgba(0,0,0,0.2)',
              }}
            >
              <AddIcon sx={{ fontSize: 48, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontFamily: 'GameFont, LaBrute, arial',
                fontSize: 18,
                color: '#733d2c',
              }}
            >
              Crear nuevo Brute
            </Typography>
          </PaperBox>
        </Grid>
      </Grid>

      {/* Stats Overview */}
      <Box sx={{ mt: 6 }}>
        <PaperBox variant="header">
          <Typography
            sx={{
              fontFamily: 'GameFont, LaBrute, arial',
              fontSize: 24,
              color: '#733d2c',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Resumen de tu Arena
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <StatBox label="Total Brutes" value={brutes.length} icon="⚔️" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatBox 
                label="Victorias" 
                value={brutes.reduce((sum: number, b: Brute) => sum + b.wins, 0)} 
                icon="🏆" 
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatBox 
                label="Derrotas" 
                value={brutes.reduce((sum: number, b: Brute) => sum + b.losses, 0)} 
                icon="💀" 
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatBox 
                label="Nivel Total" 
                value={brutes.reduce((sum: number, b: Brute) => sum + b.level, 0)} 
                icon="⭐" 
              />
            </Grid>
          </Grid>
        </PaperBox>
      </Box>
    </Container>
  );
};

// Brute Card Component
interface BruteCardProps {
  brute: Brute;
  onClick: () => void;
}

const BruteCard = ({ brute, onClick }: BruteCardProps) => (
  <PaperBox
    sx={{
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
    onClick={onClick}
  >
    {/* Brute Avatar */}
    <Box
      sx={{
        width: 120,
        height: 150,
        mx: 'auto',
        mb: 2,
        backgroundImage: `url(/images/game/misc/brute-${(brute.id % 5) + 1}.png)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
      }}
    />

    {/* Name */}
    <Typography
      sx={{
        fontFamily: 'GameFont, LaBrute, arial',
        fontSize: 22,
        color: '#733d2c',
        textAlign: 'center',
        mb: 1,
      }}
    >
      {brute.name}
    </Typography>

    {/* Level */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.5,
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Handwritten, arial',
          fontSize: 14,
          color: 'rgb(176, 107, 79)',
        }}
      >
        Nivel {brute.level}
      </Typography>
    </Box>

    {/* Stats */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <MiniStat label="V" value={brute.wins} color="#a9d346" />
      <MiniStat label="D" value={brute.losses} color="#ff8889" />
    </Box>
  </PaperBox>
);

// Mini Stat Component
interface MiniStatProps {
  label: string;
  value: number;
  color: string;
}

const MiniStat = ({ label, value, color }: MiniStatProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography
      sx={{
        fontFamily: 'LaBrute, arial',
        fontSize: 18,
        color,
        fontWeight: 'bold',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: 'arial',
        fontSize: 10,
        color: 'rgb(176, 107, 79)',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
  </Box>
);

// Stat Box Component
interface StatBoxProps {
  label: string;
  value: number;
  icon: string;
}

const StatBox = ({ label, value, icon }: StatBoxProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography sx={{ fontSize: 32, mb: 1 }}>{icon}</Typography>
    <Typography
      sx={{
        fontFamily: 'LaBrute, arial',
        fontSize: 28,
        color: '#733d2c',
        fontWeight: 'bold',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: 'Handwritten, arial',
        fontSize: 12,
        color: 'rgb(176, 107, 79)',
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default Dashboard;
