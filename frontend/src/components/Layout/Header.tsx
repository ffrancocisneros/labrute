import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#733d2c',
        backgroundImage: 'linear-gradient(180deg, #8b4f3a 0%, #733d2c 50%, #5a2d1f 100%)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1,
            }}
          >
            <SportsKabaddiIcon sx={{ fontSize: 40, color: '#f6ee90' }} />
            <Typography
              sx={{
                fontFamily: 'LaBrute, GameFont, arial',
                fontSize: { xs: 24, md: 36 },
                color: '#f6ee90',
                textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
                letterSpacing: 2,
              }}
            >
              LaBrute
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              component={Link}
              to="/leaderboard"
              startIcon={<EmojiEventsIcon />}
              sx={{
                color: '#fbf2af',
                fontFamily: 'LaBrute, arial',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Ranking
            </Button>

            {user ? (
              <>
                <Button
                  component={Link}
                  to="/dashboard"
                  startIcon={<PersonIcon />}
                  sx={{
                    color: '#fbf2af',
                    fontFamily: 'LaBrute, arial',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {user.username}
                </Button>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    color: '#ff8889',
                    fontFamily: 'LaBrute, arial',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    backgroundColor: '#a9d346',
                    color: '#fff',
                    fontFamily: 'LaBrute, arial',
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#8fb93a',
                    },
                  }}
                >
                  Entrar
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{
                    backgroundColor: '#f6ee90',
                    color: '#733d2c',
                    fontFamily: 'LaBrute, arial',
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#e8e080',
                    },
                  }}
                >
                  Registro
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
