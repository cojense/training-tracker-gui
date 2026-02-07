import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { api } from '~/utilities/api';
import { TrainingEvent } from '~/types/training';

export const ApprovalQueueView: React.FC = () => {
  const [queue, setQueue] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getApprovalQueue();
      setQueue(data);
    } catch (err) {
      console.error('Failed to fetch approval queue:', err);
      setError('Could not load the approval queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  return (
    <Card elevation={2}>
      <Box
        sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
      >
        <Typography variant="h6">Training Approval Queue</Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : queue.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Training</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      {event.user
                        ? `${event.user.first_name} ${event.user.last_name}`
                        : event.user_id}
                    </TableCell>
                    <TableCell>{event.training.title}</TableCell>
                    <TableCell>{event.completion_date}</TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" color="success">
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              The approval queue is empty.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
