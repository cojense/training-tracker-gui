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
import { useNavigate } from 'react-router-dom';
import { UserDetailTable } from '~/components/profile/UserDetailTable';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { GroupMembershipTable } from '~/components/profile/GroupMembershipTable';
import { TrainingRecordTable } from '~/components/profile/TrainingRecordTable';
import { useAuth } from '~/utilities/useAuth';
import { api } from '~/utilities/api';
import { AssignedTraining } from '~/types/assignments';
import { Group } from '~/types/user';
import { TrainingEvent } from '~/types/training';

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

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AssignedTraining[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [record, setRecord] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, groupsData, recordData] = await Promise.all([
        api.getCurrentUserAssignments(),
        api.getCurrentUserGroups(),
        api.getCurrentUserRecord(),
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

  const handleEditUserClick = useCallback(() => {
    if (user) void navigate(`/users/${user.id}/edit`);
  }, [navigate, user]);

  const handleChangeGroupsClick = useCallback(() => {
    if (user) void navigate(`/users/${user.id}/groups`);
  }, [navigate, user]);

  const handleRecordTrainingClick = useCallback(() => {
    void navigate('/events/record');
  }, [navigate]);

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
          {user?.is_admin && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleEditUserClick}
            >
              Edit User
            </Button>
          )}
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
          <TrainingDueTable assignments={assignments} />
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
              onClick={handleChangeGroupsClick}
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
            onClick={handleRecordTrainingClick}
          >
            Record Training
          </Button>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <TrainingRecordTable record={record} />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Profile;
