import { createTheme, type Components, type Theme } from '@mui/material/styles';

const sharedComponents: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
      },
      contained: {
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'box-shadow 0.2s ease-in-out',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'box-shadow 0.2s ease-in-out',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.15s ease-in-out',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.15s ease-in-out',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition:
          'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
};

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
  components: {
    ...sharedComponents,
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: 'rgba(255,255,255,0.05)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          marginLeft: 8,
          marginRight: 8,
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'rgba(114,195,252,0.15)',
            borderLeft: '3px solid #329af0',
            '& .MuiListItemIcon-root': {
              color: '#72c3fc',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #475569',
        },
      },
    },
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
  components: {
    ...sharedComponents,
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: 'rgba(0,0,0,0.03)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          marginLeft: 8,
          marginRight: 8,
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'rgba(50,154,240,0.1)',
            borderLeft: '3px solid #1c7cd6',
            '& .MuiListItemIcon-root': {
              color: '#329af0',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  },
});

export type ThemeMode = 'dark' | 'light';

export default function getTheme(mode: ThemeMode) {
  return mode === 'dark' ? darkTheme : lightTheme;
}
