import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Layout } from '../components/Layout';
import { RegisterForm } from '../components/Auth';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Layout maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 4,
            fontFamily: '"MedievalSharp", cursive',
            color: 'primary.main',
          }}
        >
          ⚔️
        </Typography>
        
        <RegisterForm />
      </Box>
    </Layout>
  );
};

export default Register;

