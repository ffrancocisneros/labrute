import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Add, SportsMma } from '@mui/icons-material';
import { Layout } from '../components/Layout';
import { BruteCard, CreateBruteForm } from '../components/Brute';
import { useAuth } from '../hooks/useAuth';
import { useMyBrutes } from '../hooks/useBrute';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { brutes, loading, error, createBrute, refetch } = useMyBrutes();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  if (authLoading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const handleCreateBrute = async (data: any) => {
    await createBrute(data);
    setShowCreateForm(false);
    refetch();
  };
  
  return (
    <Layout>
      <Box sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" color="primary.main" gutterBottom>
              Mi Arena
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenido, <strong>{user?.username}</strong>
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateForm(true)}
          >
            Nuevo Brute
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Empty State */}
        {!loading && brutes.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
              border: '2px dashed rgba(212, 175, 55, 0.3)',
            }}
          >
            <SportsMma sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No tienes ningún brute todavía
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Crea tu primer gladiador y comienza tu aventura en la arena.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setShowCreateForm(true)}
            >
              Crear mi primer Brute
            </Button>
          </Box>
        )}
        
        {/* Brute Grid */}
        {!loading && brutes.length > 0 && (
          <Grid container spacing={3}>
            {brutes.map((brute) => (
              <Grid item xs={12} sm={6} md={4} key={brute.id}>
                <BruteCard brute={brute} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Create Brute Dialog */}
        <Dialog
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ color: 'primary.main' }}>
            Crear Nuevo Brute
          </DialogTitle>
          <DialogContent>
            <CreateBruteForm
              onSubmit={handleCreateBrute}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Dashboard;

