import React, { useState, useCallback, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utilities/useAuth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
    },
    []
  );

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      void navigate(path);
      handleCloseNavMenu();
    },
    [navigate, handleCloseNavMenu]
  );

  const isActive = (path: string) => location.pathname === path;

  const navStyles = useMemo(
    () => ({
      desktopTitle: {
        mr: 2,
        display: { xs: 'none', md: 'flex' },
        cursor: 'pointer',
      },
      mobileMenuContainer: { flexGrow: 1, display: { xs: 'flex', md: 'none' } },
      mobileMenu: { display: { xs: 'block', md: 'none' } },
      mobileTitle: {
        flexGrow: 1,
        display: { xs: 'flex', md: 'none' },
        cursor: 'pointer',
      },
      desktopMenuContainer: {
        flexGrow: 1,
        display: { xs: 'none', md: 'flex' },
      },
      profileContainer: { flexGrow: 0 },
      activeLink: {
        fontWeight: 'bold',
        textDecoration: 'underline',
      },
    }),
    []
  );

  const menuAnchorOrigin = useMemo(
    () => ({
      vertical: 'bottom' as const,
      horizontal: 'left' as const,
    }),
    []
  );

  const menuTransformOrigin = useMemo(
    () => ({
      vertical: 'top' as const,
      horizontal: 'left' as const,
    }),
    []
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={navStyles.desktopTitle}
            onClick={() => handleNavigate('/')}
          >
            Shyft Training
          </Typography>

          <Box sx={navStyles.mobileMenuContainer}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={menuAnchorOrigin}
              keepMounted
              transformOrigin={menuTransformOrigin}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={navStyles.mobileMenu}
            >
              <MenuItem onClick={() => handleNavigate('/')}>
                <Typography
                  textAlign="center"
                  sx={isActive('/') ? navStyles.activeLink : {}}
                >
                  home
                </Typography>
              </MenuItem>
              {isAuthenticated && (
                <Box>
                  <MenuItem onClick={() => handleNavigate('/trainings')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/trainings') ? navStyles.activeLink : {}}
                    >
                      trainings
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/supervisor')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/supervisor') ? navStyles.activeLink : {}}
                    >
                      supervisor
                    </Typography>
                  </MenuItem>
                </Box>
              )}
              {user && (user.isAdmin || user.isTrainingManager) && (
                <Box>
                  <MenuItem onClick={() => handleNavigate('/manager')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/manager') ? navStyles.activeLink : {}}
                    >
                      manager
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/approve')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/approve') ? navStyles.activeLink : {}}
                    >
                      approve
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/users')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/users') ? navStyles.activeLink : {}}
                    >
                      users
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/groups')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/groups') ? navStyles.activeLink : {}}
                    >
                      groups
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/projects')}>
                    <Typography
                      textAlign="center"
                      sx={isActive('/projects') ? navStyles.activeLink : {}}
                    >
                      projects
                    </Typography>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={navStyles.mobileTitle}
            onClick={() => handleNavigate('/')}
          >
            Shyft Training
          </Typography>

          <Box sx={navStyles.desktopMenuContainer}>
            <Button
              onClick={() => handleNavigate('/')}
              color="inherit"
              sx={isActive('/') ? navStyles.activeLink : {}}
            >
              home
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => handleNavigate('/trainings')}
                  color="inherit"
                  sx={isActive('/trainings') ? navStyles.activeLink : {}}
                >
                  trainings
                </Button>
                <Button
                  onClick={() => handleNavigate('/supervisor')}
                  color="inherit"
                  sx={isActive('/supervisor') ? navStyles.activeLink : {}}
                >
                  supervisor
                </Button>
              </>
            )}
            {user && (user.isAdmin || user.isTrainingManager) && (
              <>
                <Button
                  onClick={() => handleNavigate('/manager')}
                  color="inherit"
                  sx={isActive('/manager') ? navStyles.activeLink : {}}
                >
                  manager
                </Button>
                <Button
                  onClick={() => handleNavigate('/approve')}
                  color="inherit"
                  sx={isActive('/approve') ? navStyles.activeLink : {}}
                >
                  approve
                </Button>
                <Button
                  onClick={() => handleNavigate('/users')}
                  color="inherit"
                  sx={isActive('/users') ? navStyles.activeLink : {}}
                >
                  users
                </Button>
                <Button
                  onClick={() => handleNavigate('/groups')}
                  color="inherit"
                  sx={isActive('/groups') ? navStyles.activeLink : {}}
                >
                  groups
                </Button>
                <Button
                  onClick={() => handleNavigate('/projects')}
                  color="inherit"
                  sx={isActive('/projects') ? navStyles.activeLink : {}}
                >
                  projects
                </Button>
              </>
            )}
          </Box>

          <Box sx={navStyles.profileContainer}>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => handleNavigate('/profile')}
                  color="inherit"
                  sx={isActive('/profile') ? navStyles.activeLink : {}}
                >
                  profile
                </Button>
                <Button onClick={() => logout()} color="inherit">
                  logout
                </Button>
              </>
            ) : (
              <Button onClick={() => console.log('login')} color="inherit">
                login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
