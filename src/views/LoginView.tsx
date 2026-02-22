import { useCallback } from 'react';
import { BACKEND_URL } from '~/services/apiClient';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';

const FRONTEND_URL = window.location.origin;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  card: { maxWidth: 400, textAlign: 'center', p: 2 },
  description: { mb: 3 },
};

export const LoginView = () => {
  const handleGoogleLogin = useCallback(() => {
    // Perform full page redirect to backend OAuth route with next parameter
    window.location.href = `${BACKEND_URL}/oauth2/login/google?next=${encodeURIComponent(FRONTEND_URL)}`;
  }, []);

  const handleDevLogin = useCallback(() => {
    // Perform full page redirect to backend dev login route with next parameter
    window.location.href = `${BACKEND_URL}/dev/login?next=${encodeURIComponent(FRONTEND_URL)}`;
  }, []);

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
            sx={styles.description}
          >
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

            {import.meta.env.DEV && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleDevLogin}
              >
                Dev Login (Bypass)
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
