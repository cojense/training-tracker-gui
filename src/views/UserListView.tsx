import { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import { Edit as EditIcon, Groups as GroupsIcon } from '@mui/icons-material';
import { api } from '~/utilities/api';
import { User } from '~/types/user';
import { useNavigate } from 'react-router-dom';

const headerBoxStyles = {
  p: 2,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
};
const contentRootStyles = { p: 0 };
const centeredBoxStyles = { textAlign: 'center', py: 4 };
const headerCellStyles = { fontWeight: 'bold' };
const errorBoxStyles = { p: 2 };

interface UserRowProps {
  user: User;
  onEdit: (id: number) => void;
  onGroups: (id: number) => void;
}

const UserRow = ({ user, onEdit, onGroups }: UserRowProps) => {
  const handleEdit = useCallback(() => onEdit(user.id), [user.id, onEdit]);
  const handleGroups = useCallback(
    () => onGroups(user.id),
    [user.id, onGroups]
  );

  const userName = `${user.first_name} ${user.last_name}`;
  const roles = [
    user.is_admin ? 'Admin' : '',
    user.is_training_manager ? 'Manager' : '',
    !user.is_admin && !user.is_training_manager ? 'Employee' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <TableRow hover>
      <TableCell>{user.id}</TableCell>
      <TableCell>{userName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{roles}</TableCell>
      <TableCell>
        <Tooltip title="Edit Profile">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Change Groups">
          <IconButton size="small" onClick={handleGroups}>
            <GroupsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export const UserListView = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Could not load the user directory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = useCallback(
    (id: number) => {
      void navigate(`/users/${id}/edit`);
    },
    [navigate]
  );

  const handleGroupsClick = useCallback(
    (id: number) => {
      void navigate(`/users/${id}/groups`);
    },
    [navigate]
  );

  return (
    <Card elevation={2}>
      <Box sx={headerBoxStyles}>
        <Typography variant="h6">User Directory</Typography>
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
                  <TableCell sx={headerCellStyles}>ID</TableCell>
                  <TableCell sx={headerCellStyles}>Name</TableCell>
                  <TableCell sx={headerCellStyles}>Email</TableCell>
                  <TableCell sx={headerCellStyles}>Roles</TableCell>
                  <TableCell sx={headerCellStyles}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    onEdit={handleEditClick}
                    onGroups={handleGroupsClick}
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
