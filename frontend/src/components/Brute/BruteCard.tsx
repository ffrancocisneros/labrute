import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  SportsMma,
  Favorite,
  Shield,
  FlashOn,
  EmojiEvents,
} from '@mui/icons-material';
import { Brute } from '../../types';
import BruteRenderer from './BruteRenderer';

interface BruteCardProps {
  brute: Brute;
  onFight?: () => void;
  showActions?: boolean;
  isOpponent?: boolean;
}

const BruteCard: React.FC<BruteCardProps> = ({
  brute,
  onFight,
  showActions = true,
  isOpponent = false,
}) => {
  const navigate = useNavigate();
  
  const winRate = brute.wins + brute.losses > 0
    ? Math.round((brute.wins / (brute.wins + brute.losses)) * 100)
    : 0;
  
  const skills = brute.skills?.map(s => s.skill) || [];
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(212, 175, 55, 0.2)',
        },
      }}
      onClick={() => navigate(`/brute/${brute.name}`)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="h3" color="primary.main" gutterBottom>
              {brute.name}
            </Typography>
            <Chip
              size="small"
              label={`Nivel ${brute.level}`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          {/* Brute Avatar */}
          <Box
            sx={{
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <BruteRenderer
              identifier={brute.identifier}
              gender={brute.gender}
              skinColor={brute.skinColor}
              hairColor={brute.hairColor}
              clothingColor={brute.clothingColor}
              bodyType={brute.bodyType}
              headType={brute.headType}
              hairType={brute.hairType}
              size={70}
              showShadow={false}
            />
          </Box>
        </Box>
        
        {/* Stats */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Favorite sx={{ color: '#dc3545', mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ mr: 1, minWidth: 50 }}>
              Vida
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (brute.health / 100) * 100)}
              sx={{
                flexGrow: 1,
                height: 8,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #dc3545 0%, #ff6b6b 100%)',
                },
              }}
            />
            <Typography variant="body2" sx={{ ml: 1, minWidth: 30, textAlign: 'right' }}>
              {brute.health}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FlashOn sx={{ color: '#ffc107', mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ mr: 1, minWidth: 50 }}>
              Fuerza
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (brute.strength / 10) * 100)}
              sx={{
                flexGrow: 1,
                height: 8,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #ffc107 0%, #ffdb4d 100%)',
                },
              }}
            />
            <Typography variant="body2" sx={{ ml: 1, minWidth: 30, textAlign: 'right' }}>
              {brute.strength}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Shield sx={{ color: '#17a2b8', mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ mr: 1, minWidth: 50 }}>
              Armadura
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (brute.armor / 10) * 100)}
              sx={{
                flexGrow: 1,
                height: 8,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #17a2b8 0%, #4dd4e8 100%)',
                },
              }}
            />
            <Typography variant="body2" sx={{ ml: 1, minWidth: 30, textAlign: 'right' }}>
              {brute.armor}
            </Typography>
          </Box>
        </Box>
        
        {/* Skills */}
        {skills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Habilidades:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skills.map((skill) => (
                <Tooltip key={skill.id} title={skill.description || skill.nameEn} arrow>
                  <Chip
                    size="small"
                    label={skill.nameEs || skill.nameEn}
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      borderColor: 'rgba(212, 175, 55, 0.5)',
                      color: 'text.secondary',
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        )}
        
        {/* Record */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEvents sx={{ color: '#d4af37', mr: 0.5, fontSize: 16 }} />
            <Typography variant="body2">
              {brute.wins}V - {brute.losses}D
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            ({winRate}% victorias)
          </Typography>
        </Box>
      </CardContent>
      
      {showActions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {isOpponent ? (
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<SportsMma />}
              onClick={(e) => {
                e.stopPropagation();
                onFight?.();
              }}
              sx={{
                background: 'linear-gradient(135deg, #dc3545 0%, #a71d2a 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e74c5e 0%, #dc3545 100%)',
                },
              }}
            >
              ¡Pelear!
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/brute/${brute.name}`);
              }}
            >
              Ver detalles
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default BruteCard;

