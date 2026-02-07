import React, { useEffect, useState, useCallback } from 'react';
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

const Trainings: React.FC = () => {
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

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  return (
    <Card elevation={2}>
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="training table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Training Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    External URL
                  </TableCell>
                  {isManager && (
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {trainings.map((training: Training) => (
                  <TableRow key={training.id} hover>
                    <TableCell component="th" scope="row">
                      {training.id}
                    </TableCell>
                    <TableCell>{training.date}</TableCell>
                    <TableCell>
                      <MuiLink
                        component={RouterLink}
                        to={`/training/${training.id}`}
                        underline="hover"
                      >
                        {training.title}
                      </MuiLink>
                    </TableCell>
                    <TableCell>
                      <MuiLink
                        component="a"
                        href={training.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        {training.url}
                      </MuiLink>
                    </TableCell>
                    {isManager && (
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(training.id)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
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
