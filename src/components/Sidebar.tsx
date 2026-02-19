import { useCallback, useMemo } from 'react';
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
  People as UsersIcon,
  Groups as GroupsIcon,
  Assignment as ProjectsIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';

const drawerWidth = 240;

const styles = {
  drawerBox: { overflow: 'auto', mt: 2 },
  navBox: { width: { md: drawerWidth }, flexShrink: { md: 0 } },
  tempDrawer: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
  },
  permDrawer: {
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      top: '64px',
      height: 'calc(100% - 64px)',
    },
  },
};

interface NavItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  visible: boolean;
}

interface NavListItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: (path: string) => void;
}
const NavListItem = ({ item, isActive, onClick }: NavListItemProps) => {
  const handleClick = useCallback(() => {
    onClick(item.path);
  }, [item.path, onClick]);

  const iconStyles = useMemo(
    () => ({
      color: isActive ? 'inherit' : 'action.active',
    }),
    [isActive]
  );

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick} selected={isActive}>
        <ListItemIcon sx={iconStyles}>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    </ListItem>
  );
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  mobile: boolean;
}
export const Sidebar = ({ open, onClose, mobile }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleNavigate = useCallback(
    (path: string) => {
      void navigate(path);
      if (mobile) onClose();
    },
    [navigate, mobile, onClose]
  );

  const isAdminOrManager = user?.is_admin || user?.is_training_manager || false;

  const navItems = useMemo(
    () => [
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
    ],
    [isAuthenticated, isAdminOrManager]
  );

  const profileItem = useMemo(
    () => ({
      text: 'Profile',
      path: '/profile',
      icon: <ProfileIcon />,
      visible: isAuthenticated,
    }),
    [isAuthenticated]
  );

  const drawerContent = (
    <Box sx={styles.drawerBox}>
      <List>
        {navItems
          .filter((item) => item.visible)
          .map((item) => (
            <NavListItem
              key={item.text}
              item={item}
              isActive={location.pathname === item.path}
              onClick={handleNavigate}
            />
          ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated && (
          <NavListItem
            item={profileItem}
            isActive={location.pathname === '/profile'}
            onClick={handleNavigate}
          />
        )}
      </List>
    </Box>
  );

  const modalProps = useMemo(() => ({ keepMounted: true }), []);

  return (
    <Box component="nav" sx={styles.navBox}>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={modalProps}
        sx={styles.tempDrawer}
      >
        {drawerContent}
      </Drawer>
      <Drawer variant="permanent" sx={styles.permDrawer} open>
        {drawerContent}
      </Drawer>
    </Box>
  );
};
