import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const ChangeGroupMembershipView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">
        Change Group Membership for User ID: {id}
      </Typography>
      <Typography variant="body1">
        This page will allow changing group memberships for a specific user.
      </Typography>
    </Box>
  );
};
