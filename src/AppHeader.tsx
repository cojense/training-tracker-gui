import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { googleLogout } from '@react-oauth/google';
import { useAuth } from './AuthContext';
import shyftLogo from '/shyft_logo.svg';

interface LayoutProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const AppHeader = ({ mode, toggleMode }: LayoutProps) => {
  const navigate = useNavigate();
  const { loginAuth, setLoginAuth, setUser } = useAuth();

  const handleLogout = () => {
    googleLogout();
    setLoginAuth(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" enableColorOnDark={true}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                onClick={() => navigate('/')}
                src={shyftLogo}
                alt="Shyft Logo"
                width="50"
                height="50"
              />

              <Typography variant="h5">Training Tracker</Typography>
            </Box>

            {loginAuth && (
              <Box sx={{ gap: 1, pl: 2 }}>
                <Button color="inherit" onClick={() => navigate('/training')}>
                  Training
                </Button>
                <Button color="inherit" onClick={() => navigate('/supervisor')}>
                  Supervisor
                </Button>
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {loginAuth && (
              <>
                <Button color="inherit" onClick={() => navigate('/profile')}>
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

            <IconButton color="inherit" onClick={toggleMode} aria-label="toggle theme">
              {mode === 'light' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default AppHeader;
