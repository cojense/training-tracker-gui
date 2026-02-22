import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Modal,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Training, TrainingEvent } from '~/types/training';
import { TrainingService } from '~/services/TrainingService';
import { useAuth } from '~/hooks/useAuth';

import { getSafeUrl } from '~/utilities/urlValidation';

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 2,
    borderColor: 'divider',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centeredBox: { textAlign: 'center', py: 4 },
  boldText: { fontWeight: 'bold' },
  flexCenter: { display: 'flex', alignItems: 'center', gap: 0.5 },
  preWrap: { whiteSpace: 'pre-wrap' },
  contentBox: { p: 2 },
  noPaddingBox: { p: 0 },
};

interface CompletionRowProps {
  event: TrainingEvent;
  isManager: boolean;
  onEditEvent: (event: TrainingEvent) => void;
}

const CompletionRow = ({
  event,
  isManager,
  onEditEvent,
}: CompletionRowProps) => {
  const handleEdit = useCallback(
    () => onEditEvent(event),
    [event, onEditEvent]
  );

  return (
    <TableRow hover>
      <TableCell>
        {event.user
          ? `${event.user.last_name}, ${event.user.first_name}`
          : 'Unknown'}
      </TableCell>
      <TableCell>{event.completion_date}</TableCell>
      <TableCell>{event.approved_date ?? 'Pending'}</TableCell>
      <TableCell>{event.comment}</TableCell>
      {isManager && (
        <TableCell>
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

interface TrainingDetailModalProps {
  training: Training | null;
  open: boolean;
  onClose: () => void;
  onEdit: (training: Training) => void;
  onEditEvent: (event: TrainingEvent) => void;
}

export const TrainingDetailModal = ({
  training,
  open,
  onClose,
  onEdit,
  onEditEvent,
}: TrainingDetailModalProps) => {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!training) return;
    try {
      setLoading(true);
      setError(null);
      const completionsData = await TrainingService.getTrainingCompletions(
        training.id
      );
      setCompletions(completionsData);
    } catch (err) {
      console.error('Failed to fetch training details:', err);
      setError('Could not load training details.');
    } finally {
      setLoading(false);
    }
  }, [training]);

  useEffect(() => {
    if (open && training) {
      void fetchData();
    }
  }, [open, training, fetchData]);

  const handleEditTraining = useCallback(() => {
    if (training) onEdit(training);
  }, [training, onEdit]);

  if (!training) return null;

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={styles.contentBox}>
            <Alert severity="error">{error ?? 'Training not found'}</Alert>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Card elevation={2}>
              <Box sx={styles.headerBox}>
                <Typography variant="h6">Training Detail</Typography>
                {isManager && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={handleEditTraining}
                    size="small"
                  >
                    Edit Training
                  </Button>
                )}
              </Box>
              <Divider />
              <CardContent sx={styles.contentBox}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="body1">{training.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">{training.date}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Title
                    </Typography>
                    <Typography variant="body1">{training.title}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={styles.preWrap}>
                      {training.description}
                    </Typography>
                  </Box>
                  {training.url && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        External URL
                      </Typography>
                      <MuiLink
                        href={getSafeUrl(training.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={styles.flexCenter}
                      >
                        {training.url} <OpenInNewIcon fontSize="inherit" />
                      </MuiLink>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <Box sx={styles.headerBox}>
                <Typography variant="h6">Completion History</Typography>
              </Box>
              <Divider />
              <CardContent sx={styles.noPaddingBox}>
                {completions.length > 0 ? (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={styles.boldText}>User</TableCell>
                          <TableCell sx={styles.boldText}>Completed</TableCell>
                          <TableCell sx={styles.boldText}>Approved</TableCell>
                          <TableCell sx={styles.boldText}>Comments</TableCell>
                          {isManager && (
                            <TableCell sx={styles.boldText}>Actions</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {completions.map((event) => (
                          <CompletionRow
                            key={event.id ?? 'new'}
                            event={event}
                            isManager={isManager}
                            onEditEvent={onEditEvent}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={styles.centeredBox}>
                    <Typography variant="body2" color="text.secondary">
                      No completion records for this training.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};
