import { Box, Container, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PaperBox, FantasyButton } from '../components/UI';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const location = useLocation();
  const initialBruteName = (location.state as any)?.bruteName || '';
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bruteName, setBruteName] = useState(initialBruteName);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard', { state: { newBruteName: bruteName } });
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
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
              ¡Únete a la Arena!
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 16,
                color: 'rgb(176, 107, 79)',
                mt: 1,
              }}
            >
              Crea tu cuenta y comienza tu aventura
            </Typography>
          </Box>

          {/* Decorative Characters */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 100,
                backgroundImage: 'url(/images/game/misc/fist.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              }}
            />
            <Box
              sx={{
                width: 80,
                height: 100,
                backgroundImage: 'url(/images/game/misc/sword.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: '#ffeaea',
                border: '2px solid #ff8889',
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
              Nombre de usuario:
            </Typography>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

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
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 14,
                color: '#733d2c',
                mb: 1,
              }}
            >
              Confirmar contraseña:
            </Typography>
            <TextField
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 14,
                color: '#733d2c',
                mb: 1,
              }}
            >
              Nombre de tu primer Brute:
            </Typography>
            <TextField
              value={bruteName}
              onChange={(e) => setBruteName(e.target.value)}
              fullWidth
              placeholder="Ej: ElDestructor"
              sx={{ mb: 4 }}
            />

            <FantasyButton
              type="submit"
              fantasy="success"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : '¡Crear cuenta!'}
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
              ¿Ya tienes cuenta?{' '}
              <Box
                component={Link}
                to="/login"
                sx={{
                  color: '#733d2c',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#5a2d1f',
                  },
                }}
              >
                ¡Inicia sesión!
              </Box>
            </Typography>
          </Box>
        </PaperBox>
      </Box>
    </Container>
  );
};

export default Register;
