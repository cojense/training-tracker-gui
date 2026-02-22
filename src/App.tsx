import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';
import Home from '~/views/Home';
import Trainings from '~/views/Trainings';
import { useAuth } from '~/utilities/useAuth';
import LoginView from '~/views/LoginView';
import Profile from '~/views/Profile';

// Restored View Imports from Stash
import { ApprovalQueueView } from '~/views/ApprovalQueueView';
import { AssignTrainingView } from '~/views/AssignTrainingView';
import { ChangeGroupMembershipView } from '~/views/ChangeGroupMembershipView';
import { EditAssignmentView } from '~/views/EditAssignmentView';
import { GroupCreateView } from '~/views/GroupCreateView';
import { GroupDetailView } from '~/views/GroupDetailView';
import { GroupEditView } from '~/views/GroupEditView';
import { GroupsView } from '~/views/GroupsView';
import { ManagerReportView } from '~/views/ManagerReportView';
import { ProjectCreateView } from '~/views/ProjectCreateView';
import { ProjectDetailView } from '~/views/ProjectDetailView';
import { ProjectEditView } from '~/views/ProjectEditView';
import { ProjectsView } from '~/views/ProjectsView';
import { RecordTrainingEventView } from '~/views/RecordTrainingEventView';
import { SupervisorView } from '~/views/SupervisorView';
import { TrainingCreateView } from '~/views/TrainingCreateView';
import { TrainingDetailView } from '~/views/TrainingDetailView';
import { TrainingEditView } from '~/views/TrainingEditView';
import { UpdateTrainingEventView } from '~/views/UpdateTrainingEventView';
import { UserEditView } from '~/views/UserEditView';
import { UserListView } from '~/views/UserListView';
import { UserDetailView } from '~/views/UserDetailView';

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
                  <Route path="/" element={<Home />} />
                  <Route path="/trainings" element={<Trainings />} />
                  <Route
                    path="/training/new"
                    element={<TrainingCreateView />}
                  />
                  <Route
                    path="/training/:id/edit"
                    element={<TrainingEditView />}
                  />
                  <Route
                    path="/training/:id"
                    element={<TrainingDetailView />}
                  />
                  <Route
                    path="/groups/:groupId/assignments/new"
                    element={<AssignTrainingView />}
                  />
                  <Route
                    path="/groups/:groupId/assignments/:trainingId/edit"
                    element={<EditAssignmentView />}
                  />
                  <Route
                    path="/events/record"
                    element={<RecordTrainingEventView />}
                  />
                  <Route
                    path="/events/:id/edit"
                    element={<UpdateTrainingEventView />}
                  />
                  <Route path="/approval" element={<ApprovalQueueView />} />
                  <Route
                    path="/manager-report"
                    element={<ManagerReportView />}
                  />
                  <Route path="/supervisor" element={<SupervisorView />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/users/:id" element={<UserDetailView />} />
                  <Route path="/users/:id/edit" element={<UserEditView />} />
                  <Route
                    path="/users/:id/groups"
                    element={<ChangeGroupMembershipView />}
                  />
                  <Route path="/users" element={<UserListView />} />
                  <Route path="/projects/new" element={<ProjectCreateView />} />
                  <Route
                    path="/projects/:id/edit"
                    element={<ProjectEditView />}
                  />
                  <Route path="/projects/:id" element={<ProjectDetailView />} />
                  <Route path="/projects" element={<ProjectsView />} />
                  <Route path="/groups" element={<GroupsView />} />
                  <Route path="/groups/:id/edit" element={<GroupEditView />} />
                  <Route path="/groups/:id" element={<GroupDetailView />} />
                  <Route path="/groups/new" element={<GroupCreateView />} />
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
