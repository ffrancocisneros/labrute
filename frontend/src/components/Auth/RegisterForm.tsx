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
import { PersonAdd } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim() || !password) {
      setError('Usuario y contraseña son obligatorios');
      return;
    }
    
    if (username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        username: username.trim(),
        email: email.trim() || undefined,
        password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
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
        Únete a la Arena
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Usuario *"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
        autoComplete="username"
        helperText="Mínimo 3 caracteres"
      />
      
      <TextField
        fullWidth
        label="Email (opcional)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
        autoComplete="email"
      />
      
      <TextField
        fullWidth
        label="Contraseña *"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
        autoComplete="new-password"
        helperText="Mínimo 6 caracteres"
      />
      
      <TextField
        fullWidth
        label="Confirmar Contraseña *"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        sx={{ mb: 3 }}
        autoComplete="new-password"
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </Button>
      
      <Typography align="center" variant="body2" color="text.secondary">
        ¿Ya tienes cuenta?{' '}
        <Link component={RouterLink} to="/login" color="primary">
          Inicia sesión
        </Link>
      </Typography>
    </Paper>
  );
};

export default RegisterForm;

