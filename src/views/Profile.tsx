import React, { useEffect, useState, useCallback } from 'react';
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
import { UserDetailTable } from '~/components/profile/UserDetailTable';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { GroupMembershipTable } from '~/components/profile/GroupMembershipTable';
import { TrainingRecordTable } from '~/components/profile/TrainingRecordTable';
import { useAuth } from '~/utilities/useAuth';
import { api } from '~/utilities/api';
import { AssignedTraining } from '~/types/assignments';
import { Group } from '~/types/user';
import { TrainingEvent } from '~/types/training';

const Profile: React.FC = () => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* User Details Card */}
      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Personal Details</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {user && <UserDetailTable user={user} />}
        </CardContent>
      </Card>

      {/* Training Requirements Card */}
      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Current Training Requirements</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TrainingDueTable assignments={assignments} />
        </CardContent>
      </Card>

      {/* Group Membership Card */}
      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Group Memberships</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <GroupMembershipTable groups={groups} />
        </CardContent>
      </Card>

      {/* Training Record Card */}
      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Training Record</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TrainingRecordTable record={record} />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Profile;
