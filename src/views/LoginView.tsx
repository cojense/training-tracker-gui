import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';

const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:5173';

const LoginView: React.FC = () => {
  const handleGoogleLogin = () => {
    // Perform full page redirect to backend OAuth route with next parameter
    window.location.href = `${BACKEND_URL}/oauth2/login/google?next=${encodeURIComponent(FRONTEND_URL)}`;
  };

  const handleDevLogin = () => {
    // Perform full page redirect to backend dev login route with next parameter
    window.location.href = `${BACKEND_URL}/dev/login?next=${encodeURIComponent(FRONTEND_URL)}`;
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

          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGoogleLogin}
            >
              Sign In with Google
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleDevLogin}
            >
              Dev Login (Bypass)
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginView;
