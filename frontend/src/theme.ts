import { createTheme } from '@mui/material/styles';

// LaBrute original color palette
const palette = {
  primary: {
    main: '#dbbf95',
    light: '#e8d4b3',
    dark: '#c9a97d',
    contrastText: '#733d2c',
  },
  secondary: {
    main: '#733d2c',
    light: '#8b4f3a',
    dark: '#5a2d1f',
    contrastText: '#fbf2af',
  },
  background: {
    default: 'rgb(235, 173, 112)',
    paper: '#fbf2af',
  },
  text: {
    primary: 'rgb(176, 107, 79)',
    secondary: 'rgba(176, 107, 79, 0.7)',
  },
  success: {
    main: '#a9d346',
    light: '#c9e57f',
    contrastText: '#fff',
  },
  error: {
    main: '#ff8889',
    light: '#fea3a3',
    contrastText: '#fff',
  },
  warning: {
    main: '#f5a623',
    light: '#f7bc55',
    contrastText: '#fff',
  },
  info: {
    main: '#4a90d9',
    light: '#7eb3e8',
    contrastText: '#fff',
  },
  divider: '#733d2c',
};

// Border colors for cards/panels
export const borderColors = {
  shadow: '#bc7b4a',
  outer: '#725254',
  main: '#f6ee90',
  inner: '#dec37f',
};

const theme = createTheme({
  palette,
  typography: {
    fontFamily: 'arial, sans-serif',
    fontSize: 12,
    h1: {
      fontFamily: 'GameFont, LaBrute, arial',
      fontWeight: 500,
      fontSize: 42,
      color: palette.text.primary,
      textShadow: '2px 2px 0 rgba(255,255,255,0.3)',
    },
    h2: {
      fontFamily: 'GameFont, LaBrute, arial',
      fontWeight: 500,
      fontSize: 32,
      color: palette.text.primary,
    },
    h3: {
      fontFamily: 'GameFont, LaBrute, arial',
      fontWeight: 500,
      fontSize: 24,
      color: palette.text.primary,
    },
    h4: {
      fontFamily: 'Handwritten, arial',
      fontWeight: 500,
      fontSize: 20,
      color: palette.text.primary,
    },
    h5: {
      fontFamily: 'Handwritten, arial',
      fontWeight: 500,
      fontSize: 16,
      color: palette.text.primary,
    },
    h6: {
      fontFamily: 'arial',
      fontWeight: 500,
      fontSize: 14,
      color: palette.text.primary,
    },
    body1: {
      fontFamily: 'Handwritten, arial',
      fontSize: 14,
      color: palette.text.primary,
    },
    body2: {
      fontFamily: 'arial',
      fontSize: 12,
      color: palette.text.secondary,
    },
    button: {
      fontFamily: 'LaBrute, GameFont, arial',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(180deg, rgba(247, 225, 183, 1) 0%, rgb(235, 173, 112) 160px)`,
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'uppercase',
          fontFamily: 'LaBrute, GameFont, arial',
          boxShadow: '2px 3px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '2px 5px rgba(0, 0, 0, 0.3)',
          },
        },
        containedPrimary: {
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          border: `2px solid ${palette.secondary.main}`,
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
        containedSecondary: {
          backgroundColor: palette.secondary.main,
          color: palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: palette.secondary.dark,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          border: `3px solid ${borderColors.main}`,
          boxShadow: `
            0 0 0 2px ${borderColors.outer},
            4px 4px 0 ${borderColors.shadow}
          `,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          border: `3px solid ${borderColors.main}`,
          boxShadow: `
            0 0 0 2px ${borderColors.outer},
            4px 4px 0 ${borderColors.shadow}
          `,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            borderRadius: 4,
            '& fieldset': {
              borderColor: borderColors.outer,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: palette.secondary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.secondary.main,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.secondary.main,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
        },
      },
    },
  },
});

export default theme;
