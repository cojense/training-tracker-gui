import { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Groups as GroupsIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { User } from '~/types/user';

const headerCellStyles = { fontWeight: 'bold' };

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

interface UserTableProps {
  users: User[];
  orderBy: keyof User | 'full_name';
  order: Order;
  onRequestSort: (property: keyof User | 'full_name') => void;
  onEdit: (id: number) => void;
  onGroups: (id: number) => void;
  onView: (id: number) => void;
}

export const UserTable = ({
  users,
  orderBy,
  order,
  onRequestSort,
  onEdit,
  onGroups,
  onView,
}: UserTableProps) => {
  const handleSortById = useCallback(
    () => onRequestSort('id'),
    [onRequestSort]
  );
  const handleSortByFullName = useCallback(
    () => onRequestSort('full_name'),
    [onRequestSort]
  );
  const handleSortByEmail = useCallback(
    () => onRequestSort('email'),
    [onRequestSort]
  );

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyles}>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={handleSortById}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell sx={headerCellStyles}>
              <TableSortLabel
                active={orderBy === 'full_name'}
                direction={orderBy === 'full_name' ? order : 'asc'}
                onClick={handleSortByFullName}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={headerCellStyles}>
              <TableSortLabel
                active={orderBy === 'email'}
                direction={orderBy === 'email' ? order : 'asc'}
                onClick={handleSortByEmail}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell sx={headerCellStyles}>Roles</TableCell>
            <TableCell sx={headerCellStyles}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              onEdit={onEdit}
              onGroups={onGroups}
              onView={onView}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
