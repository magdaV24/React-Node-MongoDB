import { ThemeOptions, createTheme } from '@mui/material/styles';

export const DarkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#985e6d',
    },
    secondary: {
      main: '#98878f',
    },
    background: {
      default: '#121113',
      paper: '#192231',
    },
    error: {
      main: '#c36262',
    },
    warning: {
      main: '#efa030',
    },
    info: {
      main: '#4a99bd',
    },
    success: {
      main: '#4a7b4c',
    },
  },
};

export const CustomDarkTheme = createTheme({
  ...DarkTheme,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.likeButton': {
            color: "#A00505",
            '&:hover': {
              color: '#CD0808',
            },
          }
        }
      }
    }
  }
})