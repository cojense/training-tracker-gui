import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '~/utilities/api';
import { Training, TrainingEvent } from '~/types/training';
import { useAuth } from '~/utilities/useAuth';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRoot: { p: 2 },
  centeredBox: { textAlign: 'center', py: 4 },
  tableHeader: { fontWeight: 'bold' },
};

export const TrainingDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [training, setTraining] = useState<Training | null>(null);
  const [completions, setCompletions] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [trainingData, completionsData] = await Promise.all([
        api.getTraining(id),
        api.getTrainingCompletions(id),
      ]);
      setTraining(trainingData);
      setCompletions(completionsData);
    } catch (err) {
      console.error('Failed to fetch training details:', err);
      setError('Could not load training details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !training) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error ?? 'Training not found'}</Alert>
      </Box>
    );
  }

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  return (
    <Stack spacing={3}>
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Training Detail</Typography>
          {isManager && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/training/${id}/edit`)}
              size="small"
            >
              Edit Training
            </Button>
          )}
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
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
                <Link
                  href={training.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  {training.url} <OpenInNewIcon fontSize="inherit" />
                </Link>
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
        <CardContent sx={{ p: 0 }}>
          {completions.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.tableHeader}>User</TableCell>
                    <TableCell sx={styles.tableHeader}>Completed</TableCell>
                    <TableCell sx={styles.tableHeader}>Approved</TableCell>
                    <TableCell sx={styles.tableHeader}>Comments</TableCell>
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
                      <TableCell>{event.approved_date ?? 'Pending'}</TableCell>
                      <TableCell>{event.comment}</TableCell>
                    </TableRow>
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
  );
};
