import { Stack } from '@mui/material';
import { useAuth } from '~/hooks/useAuth';
import { ApprovalQueueCard } from '~/components/supervisor/ApprovalQueueCard';
import { ManagerReportCard } from '~/components/supervisor/ManagerReportCard';
import { SupervisorReportCard } from '~/components/supervisor/SupervisorReportCard';

export const SupervisorView = () => {
  const { user } = useAuth();

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  return (
    <Stack spacing={3}>
      {isManager && <ApprovalQueueCard />}
      {user?.is_admin && <ManagerReportCard />}
      <SupervisorReportCard />
    </Stack>
  );
};
