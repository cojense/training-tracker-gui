import { Box, Typography } from '@mui/material';
import { useAuth } from '~/AuthContext';

export default function HomeView() {
  const { user } = useAuth();
  return (
    <>
      <Box>
        <Typography variant="h4">Hello {user?.name}!</Typography>
      </Box>
    </>
  );
}
