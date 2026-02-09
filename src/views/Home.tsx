import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '~/hooks/useAuth';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { UserService } from '~/services/UserService';
import { AssignedTraining } from '~/types/assignments';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
  },
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  errorBox: { p: 2 },
};

const Home = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AssignedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getCurrentUserAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError(
        'Could not load your training requirements. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAssignments();
  }, [fetchAssignments]);

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'User';

  return (
    <Stack spacing={3}>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome, {fullName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your training requirements and status.
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Your Training Requirements</Typography>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          {loading ? (
            <Box sx={styles.centeredBox}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={styles.errorBox}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : assignments.length > 0 ? (
            <TrainingDueTable assignments={assignments} />
          ) : (
            <Box sx={styles.centeredBox}>
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
