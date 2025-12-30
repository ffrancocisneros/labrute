import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FlashOn,
  Shield,
  Speed,
  DirectionsRun,
  FitnessCenter,
  Timer,
} from '@mui/icons-material';
import { Brute } from '../../types';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: React.ReactNode;
  tooltip?: string;
}

const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue,
  color,
  icon,
  tooltip,
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  const content = (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ color, mr: 1, display: 'flex' }}>{icon}</Box>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
            borderRadius: 1,
          },
        }}
      />
    </Box>
  );
  
  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="left">
      {content}
    </Tooltip>
  ) : (
    content
  );
};

interface BruteStatsProps {
  brute: Brute;
  compact?: boolean;
}

const BruteStats: React.FC<BruteStatsProps> = ({ brute, compact = false }) => {
  const stats = [
    {
      label: 'Vida',
      value: brute.health,
      maxValue: 200,
      color: '#dc3545',
      icon: <Favorite fontSize="small" />,
      tooltip: 'Puntos de vida totales',
    },
    {
      label: 'Fuerza',
      value: brute.strength,
      maxValue: 15,
      color: '#ffc107',
      icon: <FitnessCenter fontSize="small" />,
      tooltip: 'Aumenta el daño de los ataques',
    },
    {
      label: 'Agilidad',
      value: brute.agility,
      maxValue: 15,
      color: '#28a745',
      icon: <DirectionsRun fontSize="small" />,
      tooltip: 'Aumenta la evasión',
    },
    {
      label: 'Velocidad',
      value: brute.speed,
      maxValue: 15,
      color: '#17a2b8',
      icon: <Speed fontSize="small" />,
      tooltip: 'Afecta el orden de los turnos',
    },
    {
      label: 'Armadura',
      value: brute.armor,
      maxValue: 15,
      color: '#6c757d',
      icon: <Shield fontSize="small" />,
      tooltip: 'Reduce el daño recibido',
    },
    {
      label: 'Resistencia',
      value: brute.endurance,
      maxValue: 20,
      color: '#e83e8c',
      icon: <FlashOn fontSize="small" />,
      tooltip: 'Aumenta la vida complementaria',
    },
    {
      label: 'Iniciativa',
      value: brute.initiative,
      maxValue: 200,
      color: '#fd7e14',
      icon: <Timer fontSize="small" />,
      tooltip: 'Determina quién ataca primero',
    },
  ];
  
  if (compact) {
    return (
      <Box>
        {stats.slice(0, 4).map((stat) => (
          <StatBar key={stat.label} {...stat} />
        ))}
      </Box>
    );
  }
  
  return (
    <Paper
      sx={{
        p: 2,
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <Typography variant="h6" gutterBottom color="primary.main">
        Estadísticas
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {stats.slice(0, 4).map((stat) => (
            <StatBar key={stat.label} {...stat} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {stats.slice(4).map((stat) => (
            <StatBar key={stat.label} {...stat} />
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BruteStats;

