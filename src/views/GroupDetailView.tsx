import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const GroupDetailView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">Group Detail for ID: {id}</Typography>
      <Typography variant="body1">
        This page will display the details of a single group, including its
        members and assigned training.
      </Typography>
    </Box>
  );
};
