import { Box, Container, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperBox } from '../components/UI';
import api from '../services/api';

interface LeaderboardEntry {
  id: number;
  name: string;
  level: number;
  wins: number;
  losses: number;
  userId: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/brutes/leaderboard');
      setLeaderboard(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { backgroundColor: '#ffd700', color: '#5a2d1f' };
    if (rank === 2) return { backgroundColor: '#c0c0c0', color: '#5a2d1f' };
    if (rank === 3) return { backgroundColor: '#cd7f32', color: '#fff' };
    return { backgroundColor: '#dbbf95', color: '#733d2c' };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: 'LaBrute, GameFont, arial',
            fontSize: 42,
            color: '#733d2c',
            textShadow: '2px 2px 0 rgba(255,255,255,0.3)',
          }}
        >
          🏆 Ranking de la Arena
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Handwritten, arial',
            fontSize: 18,
            color: 'rgb(176, 107, 79)',
          }}
        >
          Los gladiadores más temidos
        </Typography>
      </Box>

      <PaperBox>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#733d2c' }} />
          </Box>
        ) : leaderboard.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 18,
                color: 'rgb(176, 107, 79)',
              }}
            >
              ¡Aún no hay gladiadores en la arena!
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Handwritten, arial',
                fontSize: 14,
                color: 'rgb(176, 107, 79)',
                mt: 1,
              }}
            >
              Sé el primero en crear un Brute y dominar el ranking
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: 'GameFont, LaBrute, arial',
                      color: '#733d2c',
                      borderBottom: '3px solid #dec37f',
                      width: 80,
                    }}
                  >
                    Rango
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: 'GameFont, LaBrute, arial',
                      color: '#733d2c',
                      borderBottom: '3px solid #dec37f',
                    }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'GameFont, LaBrute, arial',
                      color: '#733d2c',
                      borderBottom: '3px solid #dec37f',
                    }}
                  >
                    Nivel
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'GameFont, LaBrute, arial',
                      color: '#733d2c',
                      borderBottom: '3px solid #dec37f',
                    }}
                  >
                    Victorias
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'GameFont, LaBrute, arial',
                      color: '#733d2c',
                      borderBottom: '3px solid #dec37f',
                    }}
                  >
                    Derrotas
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'GameFont, LaBrute, arial',
                      color: '#733d2c',
                      borderBottom: '3px solid #dec37f',
                    }}
                  >
                    Ratio
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const rankStyle = getRankStyle(rank);
                  const ratio = entry.wins + entry.losses > 0
                    ? ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <TableRow
                      key={entry.id}
                      onClick={() => navigate(`/brute/${entry.id}`)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(219, 191, 149, 0.3)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: rank <= 3 ? 'inherit' : 'LaBrute, arial',
                            fontSize: rank <= 3 ? 24 : 14,
                            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                            ...rankStyle,
                          }}
                        >
                          {getRankIcon(rank)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 60,
                              backgroundImage: `url(/images/header/left/0${(entry.id % 10) + 1}.png)`,
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: 'GameFont, LaBrute, arial',
                              fontSize: 18,
                              color: '#733d2c',
                            }}
                          >
                            {entry.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: '#733d2c',
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'LaBrute, arial',
                              fontSize: 14,
                              color: '#f6ee90',
                            }}
                          >
                            {entry.level}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontFamily: 'LaBrute, arial',
                            fontSize: 18,
                            color: '#a9d346',
                            fontWeight: 'bold',
                          }}
                        >
                          {entry.wins}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontFamily: 'LaBrute, arial',
                            fontSize: 18,
                            color: '#ff8889',
                            fontWeight: 'bold',
                          }}
                        >
                          {entry.losses}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontFamily: 'Handwritten, arial',
                            fontSize: 14,
                            color: 'rgb(176, 107, 79)',
                          }}
                        >
                          {ratio}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PaperBox>
    </Container>
  );
};

export default Leaderboard;
