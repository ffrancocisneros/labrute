import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import { FightLogEntry } from '../../types';

interface FightLogProps {
  log: FightLogEntry[];
  attackerName: string;
  defenderName: string;
  attackerId: number;
}

const FightLog: React.FC<FightLogProps> = ({
  log,
  attackerName: _attackerName,
  defenderName: _defenderName,
  attackerId: _attackerId,
}) => {
  // Props preserved for future use in name display
  void _attackerName;
  void _defenderName;
  void _attackerId;
  const getActionColor = (action: FightLogEntry['action']) => {
    switch (action) {
      case 'attack':
        return '#dc3545';
      case 'block':
        return '#17a2b8';
      case 'evade':
        return '#28a745';
      case 'counter':
        return '#fd7e14';
      case 'miss':
        return '#6c757d';
      case 'skill':
        return '#d4af37';
      default:
        return '#ffffff';
    }
  };
  
  const getActionLabel = (action: FightLogEntry['action']) => {
    switch (action) {
      case 'attack':
        return 'Ataque';
      case 'block':
        return 'Bloqueo';
      case 'evade':
        return 'Esquiva';
      case 'counter':
        return 'Contra';
      case 'miss':
        return 'Fallo';
      case 'skill':
        return 'Habilidad';
      default:
        return action;
    }
  };
  
  return (
    <Paper
      sx={{
        p: 2,
        maxHeight: 400,
        overflow: 'auto',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <Typography variant="h6" gutterBottom color="primary.main">
        Registro de Combate
      </Typography>
      
      <List dense>
        {log.map((entry, index) => (
          <ListItem
            key={index}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              py: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                size="small"
                label={`Turno ${entry.turn}`}
                sx={{ bgcolor: 'rgba(212, 175, 55, 0.2)' }}
              />
              <Chip
                size="small"
                label={getActionLabel(entry.action)}
                sx={{
                  bgcolor: `${getActionColor(entry.action)}33`,
                  color: getActionColor(entry.action),
                  borderColor: getActionColor(entry.action),
                }}
                variant="outlined"
              />
              {entry.weaponUsed && (
                <Chip
                  size="small"
                  label={entry.weaponUsed}
                  variant="outlined"
                  sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
                />
              )}
            </Box>
            
            <Typography variant="body2">
              {entry.message}
            </Typography>
            
            {entry.damage > 0 && (
              <Typography variant="caption" color="error.main">
                -{entry.damage} daño
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FightLog;

