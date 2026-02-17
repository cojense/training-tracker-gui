import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Tooltip,
  Theme,
  useTheme,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useAuth } from '~/hooks/useAuth';
import ShyftLogo from '~/assets/shyft-logo.svg?react';

const styles = {
  appBar: { zIndex: (theme: Theme) => theme.zIndex.drawer + 1 },
  menuButton: { mr: 2, display: { md: 'none' } },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    cursor: 'pointer',
  },
  titleApp: { ml: 1, display: { xs: 'none', sm: 'block' } },
  rightActions: { display: 'flex', alignItems: 'center', gap: 2 },
  flaskButton: { display: { xs: 'none', sm: 'flex' } },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    cursor: 'pointer',
  },
  userDetails: {
    display: { xs: 'none', md: 'block' },
    textAlign: 'right',
  },
  userName: { fontWeight: 'bold', lineHeight: 1.2 },
  avatar: {
    width: 32,
    height: 32,
    bgcolor: 'primary.main',
    fontSize: '0.875rem',
  },
  logoutButton: { ml: 1 },
};

interface HeaderProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  onMenuClick: () => void;
}
export const Header = ({ mode, toggleMode, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();

  const handleLogout = useCallback(() => {
    logout();
    void navigate('/login');
  }, [logout, navigate]);

  const handleTitleClick = useCallback(() => {
    void navigate('/');
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    void navigate('/login');
  }, [navigate]);

  const handleFlaskUIClick = useCallback(() => {
    const BACKEND_URL =
      import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5001';
    window.location.href = `${BACKEND_URL}/`;
  }, []);

  const handleProfileClick = useCallback(() => {
    void navigate('/profile');
  }, [navigate]);

  const fullName = user ? `${user.first_name} ${user.last_name}` : '';

  const logoDarkColor = theme.palette.text.primary;
  const logoBlueColor = theme.palette.primary.main;

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={styles.appBar}>
      <Toolbar>
        {isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={styles.titleContainer} onClick={handleTitleClick}>
          <Box
            sx={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              '& .logo-dark': { fill: logoDarkColor },
              '& .logo-blue': { fill: logoBlueColor },
            }}
          >
            <ShyftLogo height={40} />
          </Box>
          <Typography variant="h6" noWrap component="div" sx={styles.titleApp}>
            Training Tracker
          </Typography>
        </Box>

        <Box sx={styles.rightActions}>
          <Button
            color="inherit"
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={handleFlaskUIClick}
            sx={styles.flaskButton}
          >
            Flask UI
          </Button>

          <Tooltip
            title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {isAuthenticated && user ? (
            <Box onClick={handleProfileClick} sx={styles.userContainer}>
              <Box sx={styles.userDetails}>
                <Typography variant="body2" sx={styles.userName}>
                  {fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.is_admin
                    ? 'ADMIN'
                    : user.is_training_manager
                      ? 'MANAGER'
                      : 'EMPLOYEE'}
                </Typography>
              </Box>
              <Avatar sx={styles.avatar}>{user.first_name.charAt(0)}</Avatar>
              <Button
                color="inherit"
                size="small"
                onClick={handleLogout}
                sx={styles.logoutButton}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
