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
import { User } from '~/types/user';

interface UserDetailTableProps {
  user: User;
}
export const UserDetailTable = ({ user }: UserDetailTableProps) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Training Manager</TableCell>
            <TableCell>Supervisor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.email}</TableCell>
            <StatusTableCell value={user.is_admin} />
            <StatusTableCell value={user.is_training_manager} />
            <TableCell>{user.supervisor_id}</TableCell>
          </TableRow>
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
