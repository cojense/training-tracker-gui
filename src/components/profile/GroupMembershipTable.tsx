import { useMemo } from 'react';
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

const styles = {
  header: { fontWeight: 'bold' },
};

interface StatusTableCellProps {
  value: boolean;
}

const StatusTableCell = ({ value }: StatusTableCellProps) => {
  const statusIcon = useMemo(() => {
    if (value === true) return <CheckIcon color="success" />;
    return <CloseIcon color="error" />;
  }, [value]);

  return <TableCell>{statusIcon}</TableCell>;
};

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
            <TableCell sx={styles.header}>ID</TableCell>
            <TableCell sx={styles.header}>Name</TableCell>
            <TableCell sx={styles.header}>Admin</TableCell>
            <TableCell sx={styles.header}>Training Manager</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group: Group) => (
            <TableRow key={group.id} hover>
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
