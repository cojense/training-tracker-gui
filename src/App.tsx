import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import { useAuth } from '~/hooks/useAuth';
import { LoginView } from '~/views/LoginView';
import { HomeView } from '~/views/HomeView';
import { ProfileView } from '~/views/ProfileView';
import { UsersView } from '~/views/UsersView';
import { TrainingsView } from '~/views/TrainingsView';
import { GroupsView } from '~/views/GroupsView';
import { ProjectsView } from '~/views/ProjectsView';
import { SupervisorView } from '~/views/SupervisorView';

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainLayout: { display: 'flex', flexGrow: 1 },
  contentRoot: { flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` } },
};

interface AppProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireManager = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireManager?: boolean;
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  if (requireManager && !user?.is_admin && !user?.is_training_manager) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = ({ mode, toggleMode }: AppProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleDrawerToggle = React.useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <Box sx={styles.appContainer}>
      <CssBaseline />
      <Header
        mode={mode}
        toggleMode={toggleMode}
        onMenuClick={handleDrawerToggle}
      />
      <Box sx={styles.mainLayout}>
        {isAuthenticated && (
          <Sidebar
            open={mobileOpen}
            onClose={handleDrawerToggle}
            mobile={true}
          />
        )}
        <Box component="main" sx={styles.contentRoot}>
          <Container maxWidth="lg">
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<LoginView />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<HomeView />} />
                  <Route path="/trainings" element={<TrainingsView />} />
                  <Route
                    path="/supervisor"
                    element={
                      <ProtectedRoute requireManager>
                        <SupervisorView />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/profile" element={<ProfileView />} />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute requireAdmin>
                        <UsersView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ProjectsView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/groups"
                    element={
                      <ProtectedRoute requireManager>
                        <GroupsView />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
