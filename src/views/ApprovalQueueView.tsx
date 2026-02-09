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
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { api } from '~/utilities/api';
import { TrainingEvent } from '~/types/training';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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
  errorBox: { p: 2 },
  certLink: { mr: 1 },
};

interface QueueRowProps {
  event: TrainingEvent;
  selected: boolean;
  onToggle: (id: number) => void;
  onApprove: (id: number) => void;
  onEdit: (id: number) => void;
}

const QueueRow = ({
  event,
  selected,
  onToggle,
  onApprove,
  onEdit,
}: QueueRowProps) => {
  const userName = event.user
    ? `${event.user.last_name}, ${event.user.first_name}`
    : `User ID: ${event.user_id}`;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={() => onToggle(event.id!)} />
      </TableCell>
      <TableCell>
        <Link
          component={RouterLink}
          to={`/users/${event.user_id}`}
          underline="hover"
        >
          {userName}
        </Link>
      </TableCell>
      <TableCell>{event.training.title}</TableCell>
      <TableCell>{event.completion_date}</TableCell>
      <TableCell>
        {event.certificate_unavailable ? (
          <i>unavailable</i>
        ) : event.training_certificates.length === 0 ? (
          <b>missing</b>
        ) : (
          event.training_certificates.map((cert, index) => {
            const BACKEND_URL =
              import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
            return (
              <Link
                key={cert.id ?? index}
                href={`${BACKEND_URL}/api/certificates/${cert.id}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={styles.certLink}
              >
                cert{index > 0 ? index + 1 : ''}
              </Link>
            );
          })
        )}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Approve">
            <IconButton
              size="small"
              color="success"
              onClick={() => onApprove(event.id!)}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(event.id!)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export const ApprovalQueueView = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<TrainingEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getApprovalQueue();
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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelectedIds(new Set(queue.map((e) => e.id!)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [queue]
  );

  const handleApproveOne = useCallback(
    async (id: number) => {
      try {
        setApproving(true);
        await api.approveEvent(id);
        showNotification('Training approved.', 'success');
        void fetchQueue();
      } catch (err) {
        console.error('Failed to approve training:', err);
        showNotification('Failed to approve training.', 'error');
      } finally {
        setApproving(false);
      }
    },
    [fetchQueue, showNotification]
  );

  const handleApproveSelected = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    try {
      setApproving(true);
      // Sequential API calls as requested to avoid backend modification
      for (const id of ids) {
        await api.approveEvent(id);
      }
      showNotification(
        `Successfully approved ${ids.length} records.`,
        'success'
      );
      void fetchQueue();
    } catch (err) {
      console.error('Failed to approve selected trainings:', err);
      showNotification(
        'Some approvals may have failed. Please refresh.',
        'error'
      );
      void fetchQueue();
    } finally {
      setApproving(false);
    }
  }, [selectedIds, fetchQueue, showNotification]);

  const handleEdit = useCallback(
    (id: number) => {
      void navigate(`/events/${id}/edit`);
    },
    [navigate]
  );

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
          onClick={handleApproveSelected}
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
          <Box sx={styles.errorBox}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : queue.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={
                        selectedIds.size > 0 && selectedIds.size < queue.length
                      }
                      onChange={handleToggleAll}
                    />
                  </TableCell>
                  <TableCell sx={styles.headerCell}>User</TableCell>
                  <TableCell sx={styles.headerCell}>Training</TableCell>
                  <TableCell sx={styles.headerCell}>Date</TableCell>
                  <TableCell sx={styles.headerCell}>Certificates</TableCell>
                  <TableCell sx={styles.headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((event) => (
                  <QueueRow
                    key={event.id}
                    event={event}
                    selected={selectedIds.has(event.id!)}
                    onToggle={handleToggle}
                    onApprove={handleApproveOne}
                    onEdit={handleEdit}
                  />
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
    </Card>
  );
};
