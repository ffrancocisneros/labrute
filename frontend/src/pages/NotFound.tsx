import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PaperBox, FantasyButton } from '../components/UI';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <PaperBox sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'LaBrute, GameFont, arial',
              fontSize: 120,
              color: '#733d2c',
              lineHeight: 1,
              textShadow: '4px 4px 0 rgba(255,255,255,0.3)',
            }}
          >
            404
          </Typography>

          <Box
            sx={{
              width: 150,
              height: 180,
              mx: 'auto',
              my: 3,
              backgroundImage: 'url(/images/game/misc/confused.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            }}
          />

          <Typography
            sx={{
              fontFamily: 'GameFont, LaBrute, arial',
              fontSize: 24,
              color: '#733d2c',
              mb: 2,
            }}
          >
            ¡Página no encontrada!
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Handwritten, arial',
              fontSize: 16,
              color: 'rgb(176, 107, 79)',
              mb: 4,
            }}
          >
            Parece que este gladiador se perdió en la arena...
          </Typography>

          <FantasyButton fantasy="primary" onClick={() => navigate('/')}>
            Volver al Inicio
          </FantasyButton>
        </PaperBox>
      </Box>
    </Container>
  );
};

export default NotFound;
