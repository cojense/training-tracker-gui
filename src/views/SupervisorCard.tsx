import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';

export const supervisorCardStyles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  headerCell: { fontWeight: 'bold' },
  errorBox: { p: 2 },
};

interface SupervisorCardProps {
  title: string;
  loading?: boolean;
  error?: string | null;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

export const SupervisorCard: React.FC<SupervisorCardProps> = ({
  title,
  loading,
  error,
  headerAction,
  children,
  empty,
  emptyMessage = 'No data available.',
}) => {
  return (
    <Card elevation={2}>
      <Box sx={supervisorCardStyles.headerBox}>
        <Typography variant="h6">{title}</Typography>
        {headerAction}
      </Box>
      <Divider />
      <CardContent sx={supervisorCardStyles.contentRoot}>
        {loading ? (
          <Box sx={supervisorCardStyles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={supervisorCardStyles.errorBox}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : empty ? (
          <Box sx={supervisorCardStyles.centeredBox}>
            <Typography variant="body1" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
