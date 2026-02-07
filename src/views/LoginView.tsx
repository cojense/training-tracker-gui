import React, { useCallback } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useAuth } from '~/utilities/useAuth';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  card: {
    maxWidth: 400,
    textAlign: 'center',
    p: 2,
  },
  secondaryText: { mb: 3 },
};
const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(() => {
    login();
    void navigate('/');
  }, [login, navigate]);

  return (
    <Box sx={styles.container}>
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome to Training Tracker
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={styles.secondaryText}
          >
            Please sign in to access your training requirements.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Sign In (Mock)
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginView;
