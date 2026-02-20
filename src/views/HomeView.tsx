import { Typography, Card, CardContent, Stack } from '@mui/material';
import { useAuth } from '~/hooks/useAuth';
import { TrainingRequirementsCard } from '~/components/trainings/TrainingRequirementsCard';

export const HomeView = () => {
  const { user } = useAuth();

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

      <TrainingRequirementsCard />
    </Stack>
  );
};
