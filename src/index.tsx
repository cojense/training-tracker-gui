import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import getTheme, { ThemeMode } from '~/theme';
import { AuthProvider } from '~/AuthContext';
import App from '~/App';

const OAUTHClientID = import.meta.env.VITE_OAUTH_Client_ID;
if (OAUTHClientID === null) throw new Error('Oauth token is not defined');

function Main() {
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [mode, setMode] = React.useState<ThemeMode>(prefersDark ? 'dark' : 'light');
  const toggleMode = () => setMode((prev: string) => (prev === 'dark' ? 'light' : 'dark'));

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <GoogleOAuthProvider clientId={OAUTHClientID}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App mode={mode} toggleMode={toggleMode} />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
