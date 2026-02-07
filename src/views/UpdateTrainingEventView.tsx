import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const UpdateTrainingEventView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">Update Training Event ID: {id}</Typography>
      <Typography variant="body1">
        This page will contain the form for updating an existing training event.
      </Typography>
    </Box>
  );
};
