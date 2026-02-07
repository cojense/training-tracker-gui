import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const ProjectEditView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">Edit Project ID: {id}</Typography>
      <Typography variant="body1">
        This page will contain the form for editing an existing project.
      </Typography>
    </Box>
  );
};
