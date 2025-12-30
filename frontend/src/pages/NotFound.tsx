import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Layout } from '../components/Layout';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '8rem',
            fontFamily: '"MedievalSharp", cursive',
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          ¡Gladiador perdido!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          La página que buscas no existe o ha sido movida a otra arena.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Layout>
  );
};

export default NotFound;

