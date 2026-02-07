import {
  TableRow,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Group, User } from '~/types/user';

interface UserDetailTableProps {
  user: User;
}
export const GroupMembershipTable = ({ user }: UserDetailTableProps) => {
  if (!user.groups || user.groups.length === 0) {
    return <div>User is not a member of any groups.</div>;
  }
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Training Manager</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.groups.map((group: Group) => (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell>{group.name}</TableCell>
              <StatusTableCell value={group.is_admin} />
              <StatusTableCell value={group.is_training_manager} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface StatusTableCellProps {
  value: boolean;
}
const StatusTableCell = ({ value }: StatusTableCellProps) => {
  let statusIcon;
  if (value === true) statusIcon = <CheckIcon color="success" />;
  else statusIcon = <CloseIcon color="error" />;

  return <TableCell>{statusIcon}</TableCell>;
};
