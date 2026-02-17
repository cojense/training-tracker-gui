import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Modal,
  Stack,
} from '@mui/material';
import { User } from '~/types/user';
import { AssignedTraining } from '~/types/assignments';
import { TrainingEvent } from '~/types/training';
import { Group } from '~/types/user';
import { UserService } from '~/services/UserService';
import { UserDetailTable } from '~/components/users/UserDetailTable';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { GroupMembershipTable } from '~/components/users/GroupMembershipTable';
import { TrainingRecordTable } from '~/components/users/TrainingRecordTable';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 2, borderColor: 'divider',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface UserDetailModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export const UserDetailModal = ({ user, open, onClose }: UserDetailModalProps) => {
  const [assignments, setAssignments] = useState<AssignedTraining[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [record, setRecord] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, groupsData, recordData] =
        await Promise.all([
          UserService.getUserAssignments(user.id),
          UserService.getUserGroups(user.id),
          UserService.getUserRecord(user.id),
        ]);
      setAssignments(assignmentsData);
      setGroups(groupsData);
      setRecord(recordData);
    } catch (err) {
      console.error('Failed to fetch user detail data:', err);
      setError(
        'Could not load user details. They may not exist or you may lack permission.'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user) {
      void fetchData();
    }
  }, [open, user, fetchData]);

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error ?? 'User not found'}</Alert>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom>
              User Detail: {user.first_name} {user.last_name}
            </Typography>

            {/* User Details Card */}
            <Card elevation={2}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6">Personal Details</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <UserDetailTable user={user} />
              </CardContent>
            </Card>

            {/* Training Requirements Card */}
            <Card elevation={2}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6">Current Training Requirements</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <TrainingDueTable
                  assignments={assignments}
                  onSaveSuccess={fetchData}
                />
              </CardContent>
            </Card>

            {/* Group Membership Card */}
            <Card elevation={2}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6">Group Memberships</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <GroupMembershipTable groups={groups} />
              </CardContent>
            </Card>

            {/* Training Record Card */}
            <Card elevation={2}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6">Training Record</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <TrainingRecordTable record={record} />
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};
