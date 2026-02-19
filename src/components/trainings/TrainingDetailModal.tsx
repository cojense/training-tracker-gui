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

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  borderRadius: '12px',
  bgcolor: 'background.paper',
  border: 2, borderColor: 'divider',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const headerBoxStyles = {
  p: 2,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const centeredBoxStyles = { textAlign: 'center', py: 4 };

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

  if (!training) return null;

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {loading ? (
          <Box sx={centeredBoxStyles}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error ?? 'Training not found'}</Alert>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Card elevation={2}>
              <Box sx={headerBoxStyles}>
                <Typography variant="h6">Training Detail</Typography>
                {isManager && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(training)}
                    size="small"
                  >
                    Edit Training
                  </Button>
                )}
              </Box>
              <Divider />
              <CardContent sx={{ p: 2 }}>
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
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {training.description}
                    </Typography>
                  </Box>
                  {training.url && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        External URL
                      </Typography>
                      <MuiLink
                        href={training.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {training.url} <OpenInNewIcon fontSize="inherit" />
                      </MuiLink>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <Box sx={headerBoxStyles}>
                <Typography variant="h6">Completion History</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {completions.length > 0 ? (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell >
                            User
                          </TableCell>
                          <TableCell >
                            Completed
                          </TableCell>
                          <TableCell >
                            Approved
                          </TableCell>
                          <TableCell >
                            Comments
                          </TableCell>
                          {isManager && (
                            <TableCell >
                              Actions
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {completions.map((event) => (
                          <TableRow key={event.id} hover>
                            <TableCell>
                              {event.user
                                ? `${event.user.last_name}, ${event.user.first_name}`
                                : 'Unknown'}
                            </TableCell>
                            <TableCell>{event.completion_date}</TableCell>
                            <TableCell>
                              {event.approved_date ?? 'Pending'}
                            </TableCell>
                            <TableCell>{event.comment}</TableCell>
                            {isManager && (
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => onEditEvent(event)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={centeredBoxStyles}>
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
