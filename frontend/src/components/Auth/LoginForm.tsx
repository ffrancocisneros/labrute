import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim() || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    
    try {
      await login({ username: username.trim(), password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
        border: '2px solid rgba(212, 175, 55, 0.3)',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: '"MedievalSharp", cursive',
          color: 'primary.main',
          mb: 3,
        }}
      >
        Entrar a la Arena
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
        autoComplete="username"
      />
      
      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        sx={{ mb: 3 }}
        autoComplete="current-password"
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
      
      <Typography align="center" variant="body2" color="text.secondary">
        ¿No tienes cuenta?{' '}
        <Link component={RouterLink} to="/register" color="primary">
          Regístrate aquí
        </Link>
      </Typography>
    </Paper>
  );
};

export default LoginForm;

