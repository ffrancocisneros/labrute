import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  maxWidth = 'lg',
  fullWidth = false 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Header />
      
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
          px: fullWidth ? 0 : 2,
        }}
      >
        {fullWidth ? (
          children
        ) : (
          <Container maxWidth={maxWidth}>
            {children}
          </Container>
        )}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;

