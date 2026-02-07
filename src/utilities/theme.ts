import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#ce93d8' },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
  },
});

export type ThemeMode = 'dark' | 'light';

export default function getTheme(mode: ThemeMode) {
  return mode === 'dark' ? darkTheme : lightTheme;
}
