import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Tooltip,
  IconButton,
  Box,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { TrainingService } from '~/services/TrainingService';
import { TrainingEvent } from '~/types/training';
import { useNotification } from '~/hooks/useNotification';
import { TrainingEventModal } from '~/components/trainings/TrainingEventModal';
import { SupervisorCard } from './SupervisorCard';

const actionBoxStyles = { display: 'flex', gap: 1 };

interface RowProps {
  event: TrainingEvent;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onApprove: (id: number) => void;
  onEdit: (event: TrainingEvent) => void;
}

const ApprovalQueueRow: React.FC<RowProps> = ({
  event,
  isSelected,
  onToggle,
  onApprove,
  onEdit,
}) => {
  const handleToggle = useCallback(
    () => onToggle(event.id!),
    [onToggle, event.id]
  );
  const handleApprove = useCallback(
    () => onApprove(event.id!),
    [onApprove, event.id]
  );
  const handleEdit = useCallback(() => onEdit(event), [onEdit, event]);

  return (
    <TableRow hover selected={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected} onChange={handleToggle} />
      </TableCell>
      <TableCell>
        {event.user
          ? `${event.user.last_name}, ${event.user.first_name}`
          : `ID: ${event.user_id}`}
      </TableCell>
      <TableCell>{event.training.title}</TableCell>
      <TableCell>{event.completion_date}</TableCell>
      <TableCell>
        <Box sx={actionBoxStyles}>
          <Tooltip title="Approve">
            <IconButton size="small" color="success" onClick={handleApprove}>
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
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

  const handleToggleAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked)
        setSelectedIds(new Set(queue.map((e) => e.id!)));
      else setSelectedIds(new Set());
    },
    [queue]
  );

  const handleApproveOne = useCallback(
    async (id: number) => {
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
    },
    [fetchQueue, showNotification]
  );

  const handleApproveSelected = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      setApproving(true);
      for (const id of ids) await TrainingService.approveEvent(id);
      showNotification(
        `Successfully approved ${ids.length} records.`,
        'success'
      );
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

  const handleCloseEdit = useCallback(() => setEditEvent(null), []);

  const headerAction = useMemo(
    () => (
      <Button
        variant="contained"
        color="secondary"
        disabled={selectedIds.size === 0 || approving}
        onClick={handleApproveSelected}
        size="small"
      >
        Approve Selected ({selectedIds.size})
      </Button>
    ),
    [handleApproveSelected, selectedIds.size, approving]
  );

  return (
    <>
      <SupervisorCard
        title="Training Approval Queue"
        loading={loading}
        error={error}
        headerAction={headerAction}
        empty={queue.length === 0}
        emptyMessage="The approval queue is empty."
      >
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
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
                <TableCell>User</TableCell>
                <TableCell>Training</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((event) => (
                <ApprovalQueueRow
                  key={event.id}
                  event={event}
                  isSelected={selectedIds.has(event.id!)}
                  onToggle={handleToggle}
                  onApprove={handleApproveOne}
                  onEdit={setEditEvent}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SupervisorCard>
      <TrainingEventModal
        open={!!editEvent}
        onClose={handleCloseEdit}
        mode="update"
        event={editEvent}
        onSaveSuccess={fetchQueue}
      />
    </>
  );
};
