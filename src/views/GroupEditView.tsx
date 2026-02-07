import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const GroupEditView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">Edit Group ID: {id}</Typography>
      <Typography variant="body1">
        This page will contain the form for editing an existing group.
      </Typography>
    </Box>
  );
};
