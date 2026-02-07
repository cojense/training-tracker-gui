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
import { Group } from '~/types/user';

interface GroupMembershipTableProps {
  groups: Group[];
}
export const GroupMembershipTable = ({ groups }: GroupMembershipTableProps) => {
  if (!groups || groups.length === 0) {
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                User is not a member of any groups.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Admin</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Training Manager</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group: Group) => (
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
