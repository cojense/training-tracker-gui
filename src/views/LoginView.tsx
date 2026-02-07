import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useAuth } from '~/utilities/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    void navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Card sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome to Training Tracker
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
