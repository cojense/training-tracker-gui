import { useEffect, useState, useCallback, useMemo } from 'react';
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
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { Training } from '~/types/training';
import { api } from '~/utilities/api';
import { useAuth } from '~/utilities/useAuth';

const headerBoxStyles = {
  p: 2,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const contentRootStyles = { p: 0 };
const centeredBoxStyles = { textAlign: 'center', py: 4 };
const headerCellStyles = { fontWeight: 'bold' };
const errorBoxStyles = { p: 2 };
const trainingTableStyles = { minWidth: 650 };

interface TrainingRowProps {
  training: Training;
  isManager: boolean;
  onEdit: (id: number) => void;
}
const TrainingRow = ({ training, isManager, onEdit }: TrainingRowProps) => {
  const handleEdit = useCallback(
    () => onEdit(training.id),
    [training.id, onEdit]
  );

  const trainingPath = useMemo(() => `/training/${training.id}`, [training.id]);
  const externalUrl = training.url ?? '#';

  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        {training.id}
      </TableCell>
      <TableCell>{training.date}</TableCell>
      <TableCell>
        <MuiLink component={RouterLink} to={trainingPath} underline="hover">
          {training.title}
        </MuiLink>
      </TableCell>
      <TableCell>
        <MuiLink
          component="a"
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          {training.url}
        </MuiLink>
      </TableCell>
      {isManager && (
        <TableCell>
          <Button size="small" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

const Trainings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTrainings();
      setTrainings(data);
    } catch (err) {
      console.error('Failed to fetch trainings:', err);
      setError(
        'Could not load the training directory. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTrainings();
  }, [fetchTrainings]);

  const handleCreateClick = useCallback(() => {
    void navigate('/training/new');
  }, [navigate]);

  const handleEditClick = useCallback(
    (id: number) => {
      void navigate(`/training/${id}/edit`);
    },
    [navigate]
  );

  const isManager = useMemo(
    () => user?.is_admin ?? user?.is_training_manager ?? false,
    [user]
  );

  return (
    <Card elevation={2}>
      <Box sx={headerBoxStyles}>
        <Typography variant="h6">
          Training List (All Courses in System)
        </Typography>
        {isManager && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            size="small"
          >
            Create Training
          </Button>
        )}
      </Box>
      <Divider />
      <CardContent sx={contentRootStyles}>
        {loading ? (
          <Box sx={centeredBoxStyles}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={errorBoxStyles}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={trainingTableStyles} aria-label="training table">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyles}>ID</TableCell>
                  <TableCell sx={headerCellStyles}>Date</TableCell>
                  <TableCell sx={headerCellStyles}>Training Name</TableCell>
                  <TableCell sx={headerCellStyles}>External URL</TableCell>
                  {isManager && (
                    <TableCell sx={headerCellStyles}>Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {trainings.map((training: Training) => (
                  <TrainingRow
                    key={training.id}
                    training={training}
                    isManager={isManager}
                    onEdit={handleEditClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default Trainings;
