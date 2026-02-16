import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { UserService } from '~/services/UserService';
import { User } from '~/types/user';
import { UserEditModal } from '~/components/users/UserEditModal';
import { UserGroupsModal } from '~/components/users/UserGroupsModal';
import { UserDetailModal } from '~/components/users/UserDetailModal';
import { UserTable } from '~/components/users/UserTable';

const Styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  errorBox: { p: 2 },
  searchField: {
    bgcolor: 'background.paper',
    borderRadius: 1,
    width: { xs: '100%', sm: 250 },
  },
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
        <Box sx={Styles.headerBox}>
          <Typography variant="h6">User Directory</Typography>
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={Styles.searchField}
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
        </Box>
        <Divider />
        <CardContent sx={Styles.contentRoot}>
          {loading ? (
            <Box sx={Styles.centeredBox}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={Styles.errorBox}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <UserTable
              users={filteredUsers}
              orderBy={orderBy}
              order={order}
              onRequestSort={handleRequestSort}
              onEdit={handleEditClick}
              onGroups={handleGroupsClick}
              onView={handleViewClick}
            />
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
