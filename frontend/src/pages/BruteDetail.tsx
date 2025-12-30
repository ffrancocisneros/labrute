import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  SportsMma,
} from '@mui/icons-material';
import { Layout } from '../components/Layout';
import { BruteStats } from '../components/Brute';
import { BruteCard } from '../components/Brute';
import { useAuth } from '../hooks/useAuth';
import { useOpponents } from '../hooks/useBrute';
import { useFight } from '../hooks/useFight';
import { FightArena, FightLog } from '../components/Fight';
import { bruteApi } from '../services/api';
import { Brute } from '../types';

const BruteDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [brute, setBrute] = useState<Brute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { opponents, loading: loadingOpponents } = useOpponents(brute?.id);
  const { startFight, result, error: fightError, reset } = useFight();
  
  const [showFight, setShowFight] = useState(false);
  const [fightOpponent, setFightOpponent] = useState<Brute | null>(null);
  
  useEffect(() => {
    const fetchBrute = async () => {
      if (!name) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await bruteApi.getByName(name);
        if (response.success && response.data) {
          setBrute(response.data);
        } else {
          setError(response.error || 'Brute no encontrado');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el brute');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrute();
  }, [name]);
  
  const isOwner = brute && user && brute.userId === user.id;
  
  const handleFight = async (opponent: Brute) => {
    if (!brute) return;
    
    setFightOpponent(opponent);
    
    try {
      await startFight(brute.id, opponent.id);
      setShowFight(true);
    } catch (err) {
      // Error is handled in the hook
    }
  };
  
  const handleBackFromFight = () => {
    setShowFight(false);
    setFightOpponent(null);
    reset();
    // Refresh brute data
    if (name) {
      bruteApi.getByName(name).then(response => {
        if (response.success && response.data) {
          setBrute(response.data);
        }
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }
  
  if (error || !brute) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Brute no encontrado'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Layout>
    );
  }
  
  // Show fight arena if fight is in progress
  if (showFight && result && fightOpponent) {
    return (
      <Layout>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackFromFight}
          sx={{ mb: 2 }}
        >
          Volver al brute
        </Button>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <FightArena
              attacker={brute}
              defender={fightOpponent}
              result={result}
              onBack={handleBackFromFight}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FightLog
              log={result.log}
              attackerName={brute.name}
              defenderName={fightOpponent.name}
              attackerId={brute.id}
            />
          </Grid>
        </Grid>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>
      
      {fightError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fightError}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Brute Info */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'rgba(0,0,0,0.3)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brute.skinColor} 0%, ${brute.clothingColor} 100%)`,
                border: '4px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                mx: 'auto',
                mb: 2,
              }}
            >
              {brute.gender === 'male' ? '👨' : '👩'}
            </Box>
            
            <Typography variant="h4" color="primary.main" gutterBottom>
              {brute.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
              <Chip label={`Nivel ${brute.level}`} color="primary" />
              {isOwner && (
                <Chip label="Tu brute" variant="outlined" color="success" />
              )}
            </Box>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(212, 175, 55, 0.2)' }} />
            
            {/* Record */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {brute.wins}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Victorias
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {brute.losses}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Derrotas
                </Typography>
              </Box>
            </Box>
            
            {/* Skills */}
            {brute.skills && brute.skills.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Habilidades
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {brute.skills.map((s) => (
                    <Chip
                      key={s.skill.id}
                      label={s.skill.nameEs || s.skill.nameEn}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Stats & Actions */}
        <Grid item xs={12} md={8}>
          <BruteStats brute={brute} />
          
          {/* Opponents Section (only for owner) */}
          {isOwner && isAuthenticated && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SportsMma /> Oponentes Disponibles
              </Typography>
              
              {loadingOpponents ? (
                <CircularProgress />
              ) : opponents.length === 0 ? (
                <Alert severity="info">
                  No hay oponentes disponibles de nivel similar.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {opponents.map((opponent) => (
                    <Grid item xs={12} sm={6} key={opponent.id}>
                      <BruteCard
                        brute={opponent}
                        isOpponent
                        onFight={() => handleFight(opponent)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BruteDetail;

