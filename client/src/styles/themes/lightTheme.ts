import { ThemeOptions } from '@mui/material/styles';

export const LightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#482e21',
      dark: '#392117',
      light: '#9c8272',
    },
    secondary: {
      main: '#307c68',
      dark: '#21503f',
      light: '#8bcdc0',
    },
    background: {
      paper: '#f0e8ea',
      default: '#d5c7cb',
    },
    error: {
      main: '#c5223c',
      light: '#e14a5b',
      dark: '#a90e2a',
    },
    warning: {
      main: '#de581a',
      dark: '#a93f0e',
      light: '#eb7340',
    },
    info: {
      main: '#428cb6',
      dark: '#315c7f',
      light: '#5eb9dc',
    },
    success: {
      main: '#379161',
      dark: '#295f41',
      light: '#61be8d',
    },
  },
};