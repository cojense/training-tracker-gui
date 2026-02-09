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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  TableSortLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { api } from '~/utilities/api';
import { Group } from '~/types/user';
import { useNavigate } from 'react-router-dom';

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

interface GroupRowProps {
  group: Group;
  onDetails: (id: number | null) => void;
  onEdit: (id: number | null) => void;
}

const GroupRow = ({ group, onDetails, onEdit }: GroupRowProps) => {
  const handleDetails = useCallback(
    () => onDetails(group.id),
    [group.id, onDetails]
  );
  const handleEdit = useCallback(() => onEdit(group.id), [group.id, onEdit]);

  return (
    <TableRow hover>
      <TableCell>{group.id}</TableCell>
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.is_admin ? 'Yes' : 'No'}</TableCell>
      <TableCell>{group.is_training_manager ? 'Yes' : 'No'}</TableCell>
      <TableCell>
        <Tooltip title="View Details">
          <IconButton size="small" onClick={handleDetails}>
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Group">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

type Order = 'asc' | 'desc';

export const GroupsView = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Group>('name');
  const [order, setOrder] = useState<Order>('asc');

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGroups();
      setGroups(data);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError('Could not load the groups list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  const handleRequestSort = (property: keyof Group) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredGroups = useMemo(() => {
    return groups
      .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const valA = (a[orderBy] as string | number) ?? '';
        const valB = (b[orderBy] as string | number) ?? '';
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [groups, search, order, orderBy]);

  const handleDetailsClick = useCallback(
    (id: number | null) => {
      if (id !== null) void navigate(`/groups/${id}`);
    },
    [navigate]
  );

  const handleEditClick = useCallback(
    (id: number | null) => {
      if (id !== null) void navigate(`/groups/${id}/edit`);
    },
    [navigate]
  );

  const isAdminOrManager = useMemo(
    () => groups.some((g) => g.is_admin || g.is_training_manager),
    [groups]
  );

  return (
    <Card elevation={2}>
      <Box sx={headerBoxStyles}>
        <Typography variant="h6">Groups Management</Typography>
        <TextField
          size="small"
          placeholder="Search groups..."
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
            <Table>
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
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={headerCellStyles}>Admin</TableCell>
                  <TableCell sx={headerCellStyles}>Manager</TableCell>
                  <TableCell sx={headerCellStyles}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGroups.map((g) => (
                  <GroupRow
                    key={g.id ?? (isAdminOrManager ? 'none' : 'new')}
                    group={g}
                    onDetails={handleDetailsClick}
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
