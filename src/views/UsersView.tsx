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
  Groups as GroupsIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { UserService } from '~/services/UserService';
import { User } from '~/types/user';
import { UserEditModal } from '~/components/modals/UserEditModal';
import { UserGroupsModal } from '~/components/modals/UserGroupsModal';
import { UserDetailModal } from '~/components/modals/UserDetailModal';

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

interface UserRowProps {
  user: User;
  onEdit: (id: number) => void;
  onGroups: (id: number) => void;
  onView: (id: number) => void;
}
const UserRow = ({ user, onEdit, onGroups, onView }: UserRowProps) => {
  const handleEdit = useCallback(() => onEdit(user.id), [user.id, onEdit]);
  const handleGroups = useCallback(
    () => onGroups(user.id),
    [user.id, onGroups]
  );
  const handleView = useCallback(() => onView(user.id), [user.id, onView]);

  const userName = `${user.last_name}, ${user.first_name}`;
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
        <Tooltip title="View Profile">
          <IconButton size="small" onClick={handleView}>
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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

type Order = 'asc' | 'desc';

export const UsersView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof User | 'full_name'>('last_name');
  const [order, setOrder] = useState<Order>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [groupsUser, setGroupsUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUsers();
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

  const handleRequestSort = (property: keyof User | 'full_name') => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
        const searchLower = search.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        if (orderBy === 'full_name') {
          valA = `${a.last_name}, ${a.first_name}`;
          valB = `${b.last_name}, ${b.first_name}`;
        } else {
          valA = (a[orderBy] as string | number) ?? '';
          valB = (b[orderBy] as string | number) ?? '';
        }

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, search, order, orderBy]);

  const handleEditClick = useCallback(
    (id: number) => {
      const userToEdit = users.find((u) => u.id === id);
      if (userToEdit) {
        setSelectedUser(userToEdit);
      }
    },
    [users]
  );

  const handleViewClick = useCallback(
    (id: number) => {
      const userToView = users.find((u) => u.id === id);
      if (userToView) {
        setDetailUser(userToView);
      }
    },
    [users]
  );

  const handleGroupsClick = useCallback(
    (id: number) => {
      const userToEdit = users.find((u) => u.id === id);
      if (userToEdit) {
        setGroupsUser(userToEdit);
      }
    },
    [users]
  );

  const handleCloseModal = () => {
    setSelectedUser(null);
    setDetailUser(null);
    setGroupsUser(null);
    void fetchUsers();
  };

  return (
    <>
      <Card elevation={2}>
        <Box sx={headerBoxStyles}>
          <Typography variant="h6">User Directory</Typography>
          <TextField
            size="small"
            placeholder="Search users..."
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
                        active={orderBy === 'full_name'}
                        direction={orderBy === 'full_name' ? order : 'asc'}
                        onClick={() => handleRequestSort('full_name')}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={headerCellStyles}>
                      <TableSortLabel
                        active={orderBy === 'email'}
                        direction={orderBy === 'email' ? order : 'asc'}
                        onClick={() => handleRequestSort('email')}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={headerCellStyles}>Roles</TableCell>
                    <TableCell sx={headerCellStyles}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      onEdit={handleEditClick}
                      onGroups={handleGroupsClick}
                      onView={handleViewClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      <UserEditModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={handleCloseModal}
        users={users}
      />
      <UserDetailModal
        user={detailUser}
        open={!!detailUser}
        onClose={handleCloseModal}
      />
      <UserGroupsModal
        user={groupsUser}
        open={!!groupsUser}
        onClose={handleCloseModal}
        onSaveSuccess={fetchUsers}
      />
    </>
  );
};
