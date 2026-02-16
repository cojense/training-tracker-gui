import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { UserDetailTable } from '~/components/users/UserDetailTable';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { GroupMembershipTable } from '~/components/users/GroupMembershipTable';
import { TrainingRecordTable } from '~/components/users/TrainingRecordTable';
import { useAuth } from '~/hooks/useAuth';
import { UserService } from '~/services/UserService';
import { AssignedTraining } from '~/types/assignments';
import { Group } from '~/types/user';
import { TrainingEvent } from '~/types/training';
import { UserEditModal } from '~/components/users/UserEditModal';
import { UserGroupsModal } from '~/components/users/UserGroupsModal';
import { TrainingEventModal } from '~/components/trainings/TrainingEventModal';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plainHeaderBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
  },
  contentRoot: { p: 0 },
  centeredBox: { display: 'flex', justifyContent: 'center', py: 8 },
};

export const ProfileView = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AssignedTraining[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [record, setRecord] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, groupsData, recordData] = await Promise.all([
        UserService.getCurrentUserAssignments(),
        UserService.getCurrentUserGroups(),
        UserService.getCurrentUserRecord(),
      ]);
      setAssignments(assignmentsData);
      setGroups(groupsData);
      setRecord(recordData);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      setError('Could not load profile details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setGroupsModalOpen(false);
    setEventModalOpen(false);
    void fetchData();
  };

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* User Details Card */}
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Personal Details</Typography>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Profile
          </Button>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          {user && <UserDetailTable user={user} />}
        </CardContent>
      </Card>

      {/* Training Requirements Card */}
      <Card elevation={2}>
        <Box sx={styles.plainHeaderBox}>
          <Typography variant="h6">Current Training Requirements</Typography>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <TrainingDueTable assignments={assignments} onSaveSuccess={fetchData} />
        </CardContent>
      </Card>

      {/* Group Membership Card */}
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Group Memberships</Typography>
          {isManager && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => setGroupsModalOpen(true)}
            >
              Change Groups
            </Button>
          )}
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <GroupMembershipTable groups={groups} />
        </CardContent>
      </Card>

      {/* Training Record Card */}
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Training Record</Typography>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setEventModalOpen(true)}
          >
            Record Training
          </Button>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <TrainingRecordTable record={record} />
        </CardContent>
      </Card>

      <UserEditModal
        user={user}
        open={editModalOpen}
        onClose={handleCloseModal}
      />
      <UserGroupsModal
        user={user}
        open={groupsModalOpen}
        onClose={handleCloseModal}
      />
      <TrainingEventModal
        open={eventModalOpen}
        onClose={handleCloseModal}
        mode="create"
        initialUserId={user?.id}
      />
    </Stack>
  );
};
