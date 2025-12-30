import { Box, Container, Grid, Typography, CircularProgress, Alert, LinearProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PaperBox, FantasyButton } from '../components/UI';
import { useBrute, useOpponents } from '../hooks/useBrute';
import { useFight } from '../hooks/useFight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BruteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bruteId = id ? parseInt(id) : undefined;
  const { brute, loading: bruteLoading, error: bruteError } = useBrute(bruteId);
  const { opponents } = useOpponents(bruteId);
  const { startFight, loading: fightLoading } = useFight();

  const handleFight = async (opponentId: number) => {
    if (brute) {
      try {
        await startFight(brute.id, opponentId);
        // TODO: Navigate to fight view or show result
      } catch (err) {
        console.error('Fight error:', err);
      }
    }
  };

  if (bruteLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#733d2c' }} />
        </Box>
      </Container>
    );
  }

  if (bruteError || !brute) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {bruteError || 'Brute no encontrado'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <FantasyButton
          fantasy="secondary"
          onClick={() => navigate('/dashboard')}
          startIcon={<ArrowBackIcon />}
        >
          Volver
        </FantasyButton>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Brute Info */}
        <Grid item xs={12} md={4}>
          <PaperBox>
            {/* Brute Avatar */}
            <Box
              sx={{
                width: '100%',
                height: 250,
                backgroundImage: `url(/images/game/misc/brute-${(brute.id % 5) + 1}.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))',
                mb: 2,
              }}
            />

            {/* Name & Level */}
            <Typography
              sx={{
                fontFamily: 'LaBrute, GameFont, arial',
                fontSize: 32,
                color: '#733d2c',
                textAlign: 'center',
                textShadow: '2px 2px 0 rgba(255,255,255,0.3)',
              }}
            >
              {brute.name}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  backgroundColor: '#733d2c',
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'LaBrute, arial',
                    fontSize: 14,
                    color: '#f6ee90',
                  }}
                >
                  Nivel {brute.level}
                </Typography>
              </Box>
            </Box>

            {/* XP Bar */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'Handwritten, arial',
                    fontSize: 12,
                    color: 'rgb(176, 107, 79)',
                  }}
                >
                  Experiencia
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'arial',
                    fontSize: 11,
                    color: 'rgb(176, 107, 79)',
                  }}
                >
                  {brute.experience} / {brute.level * 100}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(brute.experience / (brute.level * 100)) * 100}
                sx={{
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: '#e8d4b3',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#a9d346',
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Win/Loss Record */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <RecordStat label="Victorias" value={brute.wins} color="#a9d346" />
              <RecordStat label="Derrotas" value={brute.losses} color="#ff8889" />
            </Box>
          </PaperBox>
        </Grid>

        {/* Right Column - Stats & Actions */}
        <Grid item xs={12} md={8}>
          {/* Stats */}
          <PaperBox sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: 'GameFont, LaBrute, arial',
                fontSize: 24,
                color: '#733d2c',
                mb: 3,
              }}
            >
              Estadísticas
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <StatCard
                  label="Fuerza"
                  value={brute.strength}
                  icon="💪"
                  color="#ff6b6b"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  label="Agilidad"
                  value={brute.agility}
                  icon="⚡"
                  color="#4ecdc4"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  label="Velocidad"
                  value={brute.speed}
                  icon="🏃"
                  color="#45b7d1"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  label="Vida"
                  value={brute.health}
                  icon="❤️"
                  color="#f39c12"
                />
              </Grid>
            </Grid>
          </PaperBox>

          {/* Arena */}
          <PaperBox variant="accent">
            <Typography
              sx={{
                fontFamily: 'GameFont, LaBrute, arial',
                fontSize: 24,
                color: '#733d2c',
                mb: 3,
              }}
            >
              ¡Arena de Combate!
            </Typography>

            <Box
              sx={{
                backgroundImage: 'url(/images/arena/sand.webp)',
                backgroundSize: 'cover',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                border: '3px solid #725254',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Handwritten, arial',
                  fontSize: 16,
                  color: '#fff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  mb: 3,
                }}
              >
                ¡Elige un oponente y demuestra tu valía!
              </Typography>

              {opponents.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {opponents.slice(0, 3).map((opponent) => (
                    <FantasyButton
                      key={opponent.id}
                      fantasy="error"
                      onClick={() => handleFight(opponent.id)}
                      disabled={fightLoading}
                    >
                      ⚔️ {opponent.name}
                    </FantasyButton>
                  ))}
                </Box>
              ) : (
                <FantasyButton fantasy="error" disabled={fightLoading}>
                  {fightLoading ? 'Buscando oponente...' : '⚔️ ¡Buscar Pelea!'}
                </FantasyButton>
              )}
            </Box>
          </PaperBox>

          {/* Skills & Weapons */}
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <PaperBox>
                <Typography
                  sx={{
                    fontFamily: 'GameFont, LaBrute, arial',
                    fontSize: 18,
                    color: '#733d2c',
                    mb: 2,
                  }}
                >
                  Habilidades
                </Typography>
                {brute.skills && brute.skills.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {brute.skills.map((skill) => (
                      <SkillBadge key={skill.id} name={skill.name} />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'Handwritten, arial',
                      fontSize: 14,
                      color: 'rgb(176, 107, 79)',
                      fontStyle: 'italic',
                    }}
                  >
                    Sube de nivel para desbloquear habilidades
                  </Typography>
                )}
              </PaperBox>
            </Grid>

            <Grid item xs={12} sm={6}>
              <PaperBox>
                <Typography
                  sx={{
                    fontFamily: 'GameFont, LaBrute, arial',
                    fontSize: 18,
                    color: '#733d2c',
                    mb: 2,
                  }}
                >
                  Armas
                </Typography>
                {brute.weapons && brute.weapons.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {brute.weapons.map((weapon) => (
                      <WeaponBadge key={weapon.id} name={weapon.name} />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'Handwritten, arial',
                      fontSize: 14,
                      color: 'rgb(176, 107, 79)',
                      fontStyle: 'italic',
                    }}
                  >
                    Sube de nivel para desbloquear armas
                  </Typography>
                )}
              </PaperBox>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

// Helper Components
interface RecordStatProps {
  label: string;
  value: number;
  color: string;
}

const RecordStat = ({ label, value, color }: RecordStatProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography
      sx={{
        fontFamily: 'LaBrute, arial',
        fontSize: 32,
        color,
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

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <Box
    sx={{
      textAlign: 'center',
      p: 2,
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderRadius: 2,
      border: '2px solid #dec37f',
    }}
  >
    <Typography sx={{ fontSize: 24, mb: 0.5 }}>{icon}</Typography>
    <Typography
      sx={{
        fontFamily: 'LaBrute, arial',
        fontSize: 24,
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

interface SkillBadgeProps {
  name: string;
}

const SkillBadge = ({ name }: SkillBadgeProps) => (
  <Box
    sx={{
      px: 2,
      py: 0.5,
      backgroundColor: '#4a90d9',
      borderRadius: 2,
      border: '2px solid #3a7bc0',
    }}
  >
    <Typography
      sx={{
        fontFamily: 'LaBrute, arial',
        fontSize: 12,
        color: '#fff',
      }}
    >
      {name}
    </Typography>
  </Box>
);

interface WeaponBadgeProps {
  name: string;
}

const WeaponBadge = ({ name }: WeaponBadgeProps) => (
  <Box
    sx={{
      px: 2,
      py: 0.5,
      backgroundColor: '#733d2c',
      borderRadius: 2,
      border: '2px solid #5a2d1f',
    }}
  >
    <Typography
      sx={{
        fontFamily: 'LaBrute, arial',
        fontSize: 12,
        color: '#f6ee90',
      }}
    >
      {name}
    </Typography>
  </Box>
);

export default BruteDetail;
