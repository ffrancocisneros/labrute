import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { GitHub } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        background: 'linear-gradient(180deg, transparent 0%, rgba(15, 52, 96, 0.5) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3, borderColor: 'rgba(212, 175, 55, 0.2)' }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            © {new Date().getFullYear()} LaBrute - Un clon de código abierto
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Link
              href="https://gitlab.com/eternaltwin/labrute/labrute-react"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <GitHub fontSize="small" />
              <Typography variant="body2">Basado en Eternaltwin</Typography>
            </Link>
          </Box>
        </Box>
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 2,
            fontStyle: 'italic',
          }}
        >
          LaBrute es un tributo al juego original. Todos los derechos del juego original pertenecen a sus creadores.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

