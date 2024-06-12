import { ThemeOptions } from '@mui/material/styles';

export const DarkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#cba58f',
      dark: '#bd8769',
      light: '#ffe7d3',
    },
    secondary: {
      main: '#cadaa3',
      dark: '#b5cb80',
      light: '#dfe8c7',
    },
    error: {
      main: '#a73d3f',
      dark: '#803139',
      light: '#ce6870',
    },
    success: {
      main: '#a5c065',
      dark: '#73933a',
      light: '#a5c065',
    },
    info: {
      main: '#63be88',
      dark: '#40a368',
      light: '#7fca9c',
    },
    background: {
      default: '#2d2723',
      paper: '#4f4844',
    },
  },
};