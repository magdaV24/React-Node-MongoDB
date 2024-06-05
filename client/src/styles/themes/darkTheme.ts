import { ThemeOptions, createTheme } from '@mui/material/styles';

export const DarkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFB94B',
    },
    secondary: {
      main: '#85A7B0',
    },
    background: {
      default: '#2C1100',
      paper: '#373E40',
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
      main: '#13445a',
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