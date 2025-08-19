import { createTheme } from '@mui/material/styles';

// Paleta de culori specificată
const colors = {
  primary: {
    dark: '#0B3D91',    // Albastru închis - profesional și de încredere
    main: '#4A90E2',    // Albastru deschis - prietenos și deschis
    light: '#7BB3F0',
  },
  secondary: {
    main: '#F5A623',    // Portocaliu cald - accent vibrant
    light: '#F7B955',
    dark: '#E89611',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F2F2F2',   // Gri deschis - fundaluri și secțiuni neutre
  },
  text: {
    primary: '#4A4A4A', // Gri închis - text principal
    secondary: '#666666',
  },
  grey: {
    100: '#F2F2F2',
    200: '#E0E0E0',
    300: '#CCCCCC',
    400: '#999999',
    500: '#666666',
    600: '#4A4A4A',
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      dark: colors.primary.dark,
      light: colors.primary.light,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    grey: colors.grey,
  },
  typography: {
    fontFamily: '"Open Sans", "Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", "Poppins", "Roboto", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: colors.text.primary,
    },
    h2: {
      fontFamily: '"Montserrat", "Poppins", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      color: colors.text.primary,
    },
    h3: {
      fontFamily: '"Montserrat", "Poppins", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: colors.text.primary,
    },
    h4: {
      fontFamily: '"Montserrat", "Poppins", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      color: colors.text.primary,
    },
    h5: {
      fontFamily: '"Montserrat", "Poppins", "Roboto", sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: colors.text.primary,
    },
    h6: {
      fontFamily: '"Montserrat", "Poppins", "Roboto", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${colors.primary.main}, ${colors.primary.light})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary.dark}, ${colors.primary.main})`,
          },
        },
        containedSecondary: {
          background: colors.secondary.main,
          color: '#FFFFFF',
          '&:hover': {
            background: colors.secondary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.dark,
          boxShadow: '0 2px 12px rgba(11,61,145,0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: colors.primary.light,
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: colors.secondary.main,
          color: '#FFFFFF',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;