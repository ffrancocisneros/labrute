import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { Layout } from '../components/Layout';
import { useLeaderboard } from '../hooks/useBrute';
import { useNavigate } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { brutes, loading, error } = useLeaderboard(20);
  
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return undefined;
    }
  };
  
  return (
    <Layout>
      <Box sx={{ py: 2 }}>
        <Typography
          variant="h3"
          color="primary.main"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <EmojiEvents sx={{ fontSize: 48 }} />
          Ranking de Gladiadores
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Los mejores guerreros de la arena
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Brute</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Dueño</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.main', fontWeight: 600 }}>Nivel</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.main', fontWeight: 600 }}>Victorias</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.main', fontWeight: 600 }}>Derrotas</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.main', fontWeight: 600 }}>% Victoria</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brutes.map((brute, index) => {
                  const position = index + 1;
                  const medalColor = getMedalColor(position);
                  const winRate = brute.wins + brute.losses > 0
                    ? Math.round((brute.wins / (brute.wins + brute.losses)) * 100)
                    : 0;
                  
                  return (
                    <TableRow
                      key={brute.id}
                      hover
                      onClick={() => navigate(`/brute/${brute.name}`)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(212, 175, 55, 0.1)',
                        },
                      }}
                    >
                      <TableCell>
                        {medalColor ? (
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: medalColor,
                              color: '#000',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                            }}
                          >
                            {position}
                          </Avatar>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {position}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${brute.skinColor} 0%, ${brute.clothingColor} 100%)`,
                              border: '2px solid',
                              borderColor: position <= 3 ? medalColor : 'rgba(212, 175, 55, 0.3)',
                            }}
                          />
                          <Typography fontWeight={position <= 3 ? 600 : 400}>
                            {brute.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {brute.user?.username || 'Anónimo'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={brute.level}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography color="success.main" fontWeight={600}>
                          {brute.wins}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color="error.main">
                          {brute.losses}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={`${winRate}%`}
                          sx={{
                            bgcolor: winRate >= 60 ? 'success.main' :
                                     winRate >= 40 ? 'warning.main' : 'error.main',
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
};

export default Leaderboard;

