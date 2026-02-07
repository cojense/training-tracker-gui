import React from 'react';
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
  Divider,
} from '@mui/material';
import { UserDetailTable } from '~/components/profile/UserDetailTable';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { mockAssignments, mockCurrentUser } from '~/utilities/testData';
import { GroupMembershipTable } from '~/components/profile/GroupMembershipTable';

const Profile: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {/* User Details Card */}
      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Personal Details</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <UserDetailTable user={mockCurrentUser} />
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
          <TrainingDueTable assignments={mockAssignments} />
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
          <GroupMembershipTable user={mockCurrentUser} />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Profile;
