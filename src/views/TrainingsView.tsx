import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Training, TrainingEvent } from '~/types/training';
import { TrainingService } from '~/services/TrainingService';
import { useAuth } from '~/hooks/useAuth';
import { TrainingCreateModal } from '~/components/trainings/TrainingCreateModal';
import { TrainingEditModal } from '~/components/trainings/TrainingEditModal';
import { TrainingDetailModal } from '~/components/trainings/TrainingDetailModal';
import { TrainingEventModal } from '~/components/trainings/TrainingEventModal';
import { TrainingAssignModal } from '~/components/trainings/TrainingAssignModal';
import { TrainingTable } from '~/components/trainings/TrainingTable';
import { Group } from '~/types/user';

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
const errorBoxStyles = { p: 2 };

type Order = 'asc' | 'desc';

export const TrainingsView = () => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Training>('title');
  const [order, setOrder] = useState<Order>('asc');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTraining, setEditTraining] = useState<Training | null>(null);
  const [detailTraining, setDetailTraining] = useState<Training | null>(null);
  const [assignGroup, setAssignGroup] = useState<Group | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TrainingEvent | null>(null);
  const [eventMode, setEventMode] = useState<'create' | 'update'>('create');

  const handleEditFromDetail = useCallback((training: Training) => {
    setDetailTraining(null);
    setEditTraining(training);
  }, []);

  const handleEditEventClick = useCallback((event: TrainingEvent) => {
    setDetailTraining(null);
    setEventMode('update');
    setEventToEdit(event);
    setEventModalOpen(true);
  }, []);

  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TrainingService.getTrainings();
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

  const handleRequestSort = (property: keyof Training) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredTrainings = useMemo(() => {
    return trainings
      .filter((t) =>
        (t.title ?? '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[orderBy]! ?? '';
        const valB = b[orderBy]! ?? '';
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [trainings, search, order, orderBy]);

  const handleCreateClick = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleEditClick = useCallback(
    (id: number) => {
      const trainingToEdit = trainings.find((t) => t.id === id);
      if (trainingToEdit) {
        setEditTraining(trainingToEdit);
      }
    },
    [trainings]
  );

  const handleViewClick = useCallback(
    (id: number) => {
      const trainingToView = trainings.find((t) => t.id === id);
      if (trainingToView) {
        setDetailTraining(trainingToView);
      }
    },
    [trainings]
  );

  const handleRecordEventClick = () => {
    setEventMode('create');
    setEventToEdit(null);
    setEventModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditTraining(null);
    setDetailTraining(null);
    setAssignGroup(null);
    setEventModalOpen(false);
    setEventToEdit(null);
    void fetchTrainings();
  };

  const isManager = useMemo(
    () => user?.is_admin ?? user?.is_training_manager ?? false,
    [user]
  );

  return (
    <>
      <Card elevation={2}>
        <Box sx={headerBoxStyles}>
          <Typography variant="h6">Training Directory</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search trainings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                width: { xs: '100%', sm: 250 },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }
              }}
            />
            {isManager && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateClick}
                  size="small"
                >
                  Create Training
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleRecordEventClick}
                  size="small"
                >
                  Record Training
                </Button>
              </>
            )}
          </Box>
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
            <TrainingTable
              trainings={filteredTrainings}
              isManager={isManager}
              orderBy={orderBy}
              order={order}
              onRequestSort={handleRequestSort}
              onEdit={handleEditClick}
              onView={handleViewClick}
            />
          )}
        </CardContent>
      </Card>

      <TrainingCreateModal
        open={createModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={fetchTrainings}
      />
      <TrainingEditModal
        training={editTraining}
        open={!!editTraining}
        onClose={handleCloseModal}
        onSaveSuccess={fetchTrainings}
      />
      <TrainingDetailModal
        training={detailTraining}
        open={!!detailTraining}
        onClose={handleCloseModal}
        onEdit={handleEditFromDetail}
        onEditEvent={handleEditEventClick}
      />
      <TrainingAssignModal
        open={!!assignGroup}
        onClose={handleCloseModal}
        group={assignGroup}
        onSaveSuccess={fetchTrainings}
      />
      <TrainingEventModal
        open={eventModalOpen}
        onClose={handleCloseModal}
        mode={eventMode}
        event={eventToEdit}
        onSaveSuccess={fetchTrainings}
      />
    </>
  );
};
