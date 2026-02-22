import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#72c3fc', light: '#90caf9', dark: '#329af0' },
    secondary: { main: '#ba79da' },
    background: { default: '#1e293b', paper: '#334155' },
    text: { primary: '#f1f5f9', secondary: '#cbd5e1' },
    error: { main: '#dc2626' },
    warning: { main: '#fbbf24' },
    success: { main: '#37b24d' },
    info: { main: '#3b82f6' },
    divider: '#475569',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#329af0', light: '#72c3fc', dark: '#1c7cd6' },
    secondary: { main: '#a551cf', light: '#ba79da', dark: '#8d33ba' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
    text: { primary: '#1a202c', secondary: '#4a5568' },
    error: { main: '#dc2626' },
    warning: { main: '#fbbf24' },
    success: { main: '#37b24d' },
    info: { main: '#3b82f6' },
    divider: '#e2e8f0',
  },
});

export type ThemeMode = 'dark' | 'light';

export default function getTheme(mode: ThemeMode) {
  return mode === 'dark' ? darkTheme : lightTheme;
}
