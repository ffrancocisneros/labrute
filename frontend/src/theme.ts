import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// LaBrute color palette - inspired by medieval/gladiator theme
const palette = {
  primary: {
    main: '#d4af37', // Gold
    light: '#e5c76b',
    dark: '#b8960c',
    contrastText: '#1a1a2e',
  },
  secondary: {
    main: '#8b4513', // Saddle Brown (leather)
    light: '#a0522d',
    dark: '#654321',
    contrastText: '#ffffff',
  },
  background: {
    default: '#1a1a2e', // Dark navy
    paper: '#16213e', // Slightly lighter navy
  },
  text: {
    primary: '#e0e0e0',
    secondary: '#a0a0a0',
  },
  error: {
    main: '#dc3545',
  },
  warning: {
    main: '#ffc107',
  },
  success: {
    main: '#28a745',
  },
  info: {
    main: '#17a2b8',
  },
};

let theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Cinzel", "Georgia", serif',
    h1: {
      fontFamily: '"MedievalSharp", "Uncial Antiqua", cursive',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h2: {
      fontFamily: '"MedievalSharp", "Uncial Antiqua", cursive',
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
    h3: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '10px 24px',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #d4af37 0%, #b8960c 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e5c76b 0%, #d4af37 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #8b4513 0%, #654321 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #a0522d 0%, #8b4513 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(212, 175, 55, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(212, 175, 55, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#d4af37',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Cinzel", serif',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #d4af37 0%, #b8960c 100%)',
          color: '#1a1a2e',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0f3460 0%, #16213e 50%, #0f3460 100%)',
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#16213e',
          borderRight: '1px solid rgba(212, 175, 55, 0.2)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#0f3460',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          fontFamily: '"Cinzel", serif',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(212, 175, 55, 0.2)',
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

