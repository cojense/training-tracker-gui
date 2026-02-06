import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Trainings from './views/Trainings';
import Supervisor from './views/Supervisor';
import Manager from './views/Manager';
import Approve from './views/Approve';
import Users from './views/Users';
import Groups from './views/Groups';
import Projects from './views/Projects';
import Profile from './views/Profile';

const App: React.FC = () => {
  const layoutStyles = useMemo(
    () => ({
      appContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      },
      mainContent: { mt: 4, mb: 4, flexGrow: 1 },
    }),
    []
  );

  return (
    <Box sx={layoutStyles.appContainer}>
      <CssBaseline />
      <Navbar />
      <Container component="main" sx={layoutStyles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/supervisor" element={<Supervisor />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/approve" element={<Approve />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
