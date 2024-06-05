import { ThemeOptions, createTheme } from '@mui/material/styles';

export const LightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#a04e2d',
    },
    secondary: {
      main: '#536f75',
    },
    background: {
      default: '#F6EEE0',
      paper: '#E4B7A0',
    },
    error: {
      main: '#8a1717',
    },
    warning: {
      main: '#bf360c',
    },
    info: {
      main: '#0f3f64',
    },
    success: {
      main: '#1b5e20',
    },
  },
};

export const CustomLightTheme = createTheme({
  ...LightTheme,
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