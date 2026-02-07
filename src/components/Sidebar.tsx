import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  School as TrainingIcon,
  SupervisorAccount as SupervisorIcon,
  AdminPanelSettings as ManagerIcon,
  CheckCircle as ApproveIcon,
  People as UsersIcon,
  Groups as GroupsIcon,
  Assignment as ProjectsIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/utilities/useAuth';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  mobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, mobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleNavigate = (path: string) => {
    void navigate(path);
    if (mobile) onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const isAdminOrManager = user?.isAdmin ?? user?.isTrainingManager ?? false;

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon />, visible: true },
    {
      text: 'Trainings',
      path: '/trainings',
      icon: <TrainingIcon />,
      visible: isAuthenticated,
    },
    {
      text: 'Supervisor',
      path: '/supervisor',
      icon: <SupervisorIcon />,
      visible: isAuthenticated,
    },
    {
      text: 'Manager',
      path: '/manager-report',
      icon: <ManagerIcon />,
      visible: isAdminOrManager,
    },
    {
      text: 'Approve',
      path: '/approval',
      icon: <ApproveIcon />,
      visible: isAdminOrManager,
    },
    {
      text: 'Users',
      path: '/users',
      icon: <UsersIcon />,
      visible: isAdminOrManager,
    },
    {
      text: 'Groups',
      path: '/groups',
      icon: <GroupsIcon />,
      visible: isAdminOrManager,
    },
    {
      text: 'Projects',
      path: '/projects',
      icon: <ProjectsIcon />,
      visible: isAdminOrManager,
    },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <List>
        {navItems
          .filter((item) => item.visible)
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'inherit' : 'action.active',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/profile')}
              selected={isActive('/profile')}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
