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
  TextField,
  InputAdornment,
  TableSortLabel,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
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

type Order = 'asc' | 'desc';

const Trainings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Training>('title');
  const [order, setOrder] = useState<Order>('asc');

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

  const handleRequestSort = (property: keyof Training) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredTrainings = useMemo(() => {
    return trainings
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const valA = (a[orderBy] as string | number) ?? '';
        const valB = (b[orderBy] as string | number) ?? '';
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [trainings, search, order, orderBy]);

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {isManager && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
              size="small"
            >
              Create
            </Button>
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
          <TableContainer component={Paper} elevation={0}>
            <Table sx={trainingTableStyles} aria-label="training table">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyles}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={headerCellStyles}>
                    <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? order : 'asc'}
                      onClick={() => handleRequestSort('date')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={headerCellStyles}>
                    <TableSortLabel
                      active={orderBy === 'title'}
                      direction={orderBy === 'title' ? order : 'asc'}
                      onClick={() => handleRequestSort('title')}
                    >
                      Training Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={headerCellStyles}>External URL</TableCell>
                  {isManager && (
                    <TableCell sx={headerCellStyles}>Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTrainings.map((training: Training) => (
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
