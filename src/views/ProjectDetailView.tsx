import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const ProjectDetailView = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4">Project Detail for ID: {id}</Typography>
      <Typography variant="body1">
        This page will display the details of a single project.
      </Typography>
    </Box>
  );
};
