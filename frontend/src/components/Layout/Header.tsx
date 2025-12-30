import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  EmojiEvents,
  SportsMma,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/');
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const navItems = [
    { label: 'Inicio', path: '/', icon: <SportsMma /> },
    { label: 'Ranking', path: '/leaderboard', icon: <EmojiEvents /> },
  ];
  
  const authItems = isAuthenticated
    ? [{ label: 'Mi Arena', path: '/dashboard', icon: <Dashboard /> }]
    : [];
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        ⚔️ LaBrute
      </Typography>
      <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.2)' }} />
      <List>
        {[...navItems, ...authItems].map((item) => (
          <ListItem 
            key={item.path} 
            component={RouterLink} 
            to={item.path}
            sx={{ 
              color: 'text.primary',
              '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      {!isAuthenticated && (
        <Box sx={{ px: 2, mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/login')}
            sx={{ mb: 1 }}
          >
            Entrar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/register')}
          >
            Registrarse
          </Button>
        </Box>
      )}
    </Box>
  );
  
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 0,
              textDecoration: 'none',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontFamily: '"MedievalSharp", cursive',
              fontSize: '1.5rem',
              mr: 4,
            }}
          >
            ⚔️ LaBrute
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {[...navItems, ...authItems].map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(212, 175, 55, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {isAuthenticated ? (
            <Box>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(212, 175, 55, 0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <AccountCircle sx={{ mr: 1 }} />
                  {user?.username}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                  <Dashboard sx={{ mr: 1 }} />
                  Mi Arena
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Salir
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            !isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </Box>
            )
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;

