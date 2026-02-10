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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { UserDetailTable } from '~/components/profile/UserDetailTable';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { GroupMembershipTable } from '~/components/profile/GroupMembershipTable';
import { TrainingRecordTable } from '~/components/profile/TrainingRecordTable';
import { UserService } from '~/services/UserService';
import { AssignedTraining } from '~/types/assignments';
import { Group, User } from '~/types/user';
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

export const UserDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<AssignedTraining[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [record, setRecord] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [userData, assignmentsData, groupsData, recordData] =
        await Promise.all([
          UserService.getUser(id),
          UserService.getUserAssignments(id),
          UserService.getUserGroups(id),
          UserService.getUserRecord(id),
        ]);
      setTargetUser(userData);
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
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !targetUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error ?? 'User not found'}</Alert>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>
        User Detail: {targetUser.first_name} {targetUser.last_name}
      </Typography>

      {/* User Details Card */}
      <Card elevation={2}>
        <Box sx={styles.plainHeaderBox}>
          <Typography variant="h6">Personal Details</Typography>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <UserDetailTable user={targetUser} />
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
        <Box sx={styles.plainHeaderBox}>
          <Typography variant="h6">Group Memberships</Typography>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <GroupMembershipTable groups={groups} />
        </CardContent>
      </Card>

      {/* Training Record Card */}
      <Card elevation={2}>
        <Box sx={styles.plainHeaderBox}>
          <Typography variant="h6">Training Record</Typography>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <TrainingRecordTable record={record} />
        </CardContent>
      </Card>
    </Stack>
  );
};
