import { Typography, Box } from '@mui/material';

export const ApprovalQueueView = () => {
  return (
    <Box>
      <Typography variant="h4">Approval Queue</Typography>
      <Typography variant="body1">
        This page will display a list of unapproved training events for managers
        to review.
      </Typography>
    </Box>
  );
};
