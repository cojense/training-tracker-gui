import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const EditAssignmentView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">Edit Assignment ID: {id}</Typography>
      <Typography variant="body1">
        This page will contain the form for editing an existing assignment.
      </Typography>
    </Box>
  );
};
