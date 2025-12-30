import { Box, Container, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PaperBox, FantasyButton } from '../components/UI';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username: email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <PaperBox>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              sx={{
                fontFamily: 'LaBrute, GameFont, arial',
                fontSize: 36,
                color: '#733d2c',
                textShadow: '2px 2px 0 rgba(255,255,255,0.3)',
              }}
            >
              ¡Bienvenido de vuelta!
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 16,
                color: 'rgb(176, 107, 79)',
                mt: 1,
              }}
            >
              Ingresa a tu cuenta para continuar la batalla
            </Typography>
          </Box>

          {/* Decorative Character */}
          <Box
            sx={{
              width: 100,
              height: 120,
              mx: 'auto',
              mb: 3,
              backgroundImage: 'url(/images/game/misc/idle.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            }}
          />

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: '#ffeaea',
                border: '2px solid #ff8889',
                '& .MuiAlert-icon': {
                  color: '#ff8889',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 14,
                color: '#733d2c',
                mb: 1,
              }}
            >
              Correo electrónico:
            </Typography>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
            />

            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 14,
                color: '#733d2c',
                mb: 1,
              }}
            >
              Contraseña:
            </Typography>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 4 }}
            />

            <FantasyButton
              type="submit"
              fantasy="success"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Entrando...' : '¡Entrar a la Arena!'}
            </FantasyButton>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 14,
                color: 'rgb(176, 107, 79)',
              }}
            >
              ¿No tienes cuenta?{' '}
              <Box
                component={Link}
                to="/register"
                sx={{
                  color: '#733d2c',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#5a2d1f',
                  },
                }}
              >
                ¡Regístrate!
              </Box>
            </Typography>
          </Box>
        </PaperBox>
      </Box>
    </Container>
  );
};

export default Login;
