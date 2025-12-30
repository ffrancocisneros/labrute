import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(247, 225, 183, 1) 0%, rgb(235, 173, 112) 160px)',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
