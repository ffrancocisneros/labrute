import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: '#733d2c',
        backgroundImage: 'linear-gradient(180deg, #5a2d1f 0%, #4a231a 100%)',
        borderTop: '4px solid #f6ee90',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Handwritten, arial',
              color: '#fbf2af',
              fontSize: 14,
            }}
          >
            LaBrute Clone - Basado en el juego original de Motion Twin
          </Typography>
          <Box
            component="img"
            src="/images/motiontwin.gif"
            alt="Motion Twin"
            sx={{
              height: 24,
              opacity: 0.8,
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: 'arial',
            color: 'rgba(251, 242, 175, 0.6)',
            fontSize: 11,
            textAlign: 'center',
            mt: 1,
          }}
        >
          Este proyecto es un tributo al juego original. No está afiliado con Motion Twin.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
