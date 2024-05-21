import { ThemeOptions, createTheme } from '@mui/material/styles';

export const DarkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#AAA1A0',
    },
    secondary: {
      main: '#8D8960',
    },
    background: {
      default: '#4F3750',
      paper: '#635067',
    },
    error: {
      main: '#cb4848',
      contrastText: '#ffebee',
    },
    warning: {
      main: '#f39f32',
      contrastText: '#ffebee',
    },
    info: {
      main: '#40c4ff',
      contrastText: '#ffebee',
    },
    success: {
      main: '#2e7d32',
      contrastText: '#ffebee',
    },
    divider: '#2f201a',
  },
};

export const CustomDarkTheme = createTheme({
  ...DarkTheme,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.likeButton': {
            color: "#AD1829",
            '&:hover': {
              color: '#CD0808',
            },
          }
        }
      }
    }
  }
})