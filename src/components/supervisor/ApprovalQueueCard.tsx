import { useEffect, useState, useCallback, useMemo } from 'react';
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
  Checkbox,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { TrainingService } from '~/services/TrainingService';
import { TrainingEvent } from '~/types/training';
import { useNotification } from '~/hooks/useNotification';
import { TrainingEventModal } from '~/components/trainings/TrainingEventModal';

const styles = {
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
};

export const ApprovalQueueCard = () => {
  const { showNotification } = useNotification();
  const [queue, setQueue] = useState<TrainingEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editEvent, setEditEvent] = useState<TrainingEvent | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TrainingService.getApprovalQueue();
      setQueue(data);
      setSelectedIds(new Set());
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

  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setSelectedIds(new Set(queue.map((e) => e.id!)));
    else setSelectedIds(new Set());
  }, [queue]);

  const handleApproveOne = useCallback(async (id: number) => {
    try {
      setApproving(true);
      await TrainingService.approveEvent(id);
      showNotification('Training approved.', 'success');
      void fetchQueue();
    } catch (err) {
      console.error('Failed to approve training:', err);
      showNotification('Failed to approve training.', 'error');
    } finally {
      setApproving(false);
    }
  }, [fetchQueue, showNotification]);

  const handleApproveSelected = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      setApproving(true);
      for (const id of ids) await TrainingService.approveEvent(id);
      showNotification(`Successfully approved ${ids.length} records.`, 'success');
      void fetchQueue();
    } catch (err) {
      console.error('Failed to approve selected trainings:', err);
      showNotification('Some approvals may have failed.', 'error');
      void fetchQueue();
    } finally {
      setApproving(false);
    }
  }, [selectedIds, fetchQueue, showNotification]);

  const allSelected = useMemo(
    () => queue.length > 0 && selectedIds.size === queue.length,
    [queue, selectedIds]
  );

  return (
    <Card elevation={2}>
      <Box sx={styles.headerBox}>
        <Typography variant="h6">Training Approval Queue</Typography>
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedIds.size === 0 || approving}
          onClick={() => void handleApproveSelected()}
          size="small"
        >
          Approve Selected ({selectedIds.size})
        </Button>
      </Box>
      <Divider />
      <CardContent sx={styles.contentRoot}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : queue.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selectedIds.size > 0 && selectedIds.size < queue.length}
                      onChange={handleToggleAll}
                    />
                  </TableCell>
                  <TableCell sx={styles.headerCell}>User</TableCell>
                  <TableCell sx={styles.headerCell}>Training</TableCell>
                  <TableCell sx={styles.headerCell}>Date</TableCell>
                  <TableCell sx={styles.headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((event) => (
                  <TableRow key={event.id} hover selected={selectedIds.has(event.id!)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.has(event.id!)}
                        onChange={() => handleToggle(event.id!)}
                      />
                    </TableCell>
                    <TableCell>
                      {event.user ? `${event.user.last_name}, ${event.user.first_name}` : `ID: ${event.user_id}`}
                    </TableCell>
                    <TableCell>{event.training.title}</TableCell>
                    <TableCell>{event.completion_date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => void handleApproveOne(event.id!)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => setEditEvent(event)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={styles.centeredBox}>
            <Typography variant="body1" color="text.secondary">
              The approval queue is empty.
            </Typography>
          </Box>
        )}
      </CardContent>
      <TrainingEventModal
        open={!!editEvent}
        onClose={() => setEditEvent(null)}
        mode="update"
        event={editEvent}
        onSaveSuccess={fetchQueue}
      />
    </Card>
  );
};
