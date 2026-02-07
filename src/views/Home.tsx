import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import { useAuth } from '~/utilities/useAuth';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { mockAssignments } from '~/utilities/testData';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Stack spacing={3}>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your training requirements and status.
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Your Training Requirements</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {mockAssignments.length > 0 ? (
            <TrainingDueTable assignments={mockAssignments} />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                ✅ You have no training due!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up. Great work!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Home;
