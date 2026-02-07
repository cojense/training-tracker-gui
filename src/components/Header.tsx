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
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useAuth } from '~/utilities/useAuth';

interface HeaderProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, toggleMode, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
    window.location.href = 'http://localhost:5001/';
  }, []);

  const handleProfileClick = useCallback(() => {
    void navigate('/profile');
  }, [navigate]);

  const fullName = user ? `${user.first_name} ${user.last_name}` : '';

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
          }}
          onClick={handleTitleClick}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            SHYFT
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Training Tracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={handleFlaskUIClick}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
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
            <Box
              onClick={handleProfileClick}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  textAlign: 'right',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', lineHeight: 1.2 }}
                >
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
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {user.first_name.charAt(0)}
              </Avatar>
              <Button
                color="inherit"
                size="small"
                onClick={handleLogout}
                sx={{ ml: 1 }}
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

export default Header;
