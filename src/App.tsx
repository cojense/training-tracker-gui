import { Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import HomeView from '~/views/HomeView';
import AppHeader from '~/AppHeader';
import LoginView from '~/views/LoginView';
import TrainingView from '~/views/TrainingView';
import { useAuth } from '~/AuthContext';
import { SupervisorView } from '~/views/SupervisorView';
import { ProfileView } from '~/views/ProfileView';

interface AppProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

function App({ mode, toggleMode }: AppProps) {
  const { loginAuth } = useAuth();
  return (
    <>
      <AppHeader mode={mode} toggleMode={toggleMode} />

      <Container component="main">
        <Routes>
          {!loginAuth ? (
            <Route path="/login" element={<LoginView />} />
          ) : (
            <>
              <Route path="/" element={<HomeView />} />
              <Route path="/training" element={<TrainingView />} />
              <Route path="/supervisor" element={<SupervisorView />} />
              <Route path="/profile" element={<ProfileView />} />
            </>
          )}
          <Route path="*" element={<Navigate to={loginAuth ? '/' : '/login'} />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
