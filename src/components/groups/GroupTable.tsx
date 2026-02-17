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
import { Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { Group } from '~/types/user';

const styles = {
  headerCell: { fontWeight: 'bold' },
};

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
          <IconButton size="small" onClick={handleDetails} aria-label="Details">
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Group">
          <IconButton size="small" onClick={handleEdit} aria-label="Edit">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

type Order = 'asc' | 'desc';

interface GroupTableProps {
  groups: Group[];
  orderBy: keyof Group;
  order: Order;
  onRequestSort: (property: keyof Group) => void;
  onDetails: (id: number | null) => void;
  onEdit: (id: number | null) => void;
}

export const GroupTable = ({
  groups,
  orderBy,
  order,
  onRequestSort,
  onDetails,
  onEdit,
}: GroupTableProps) => {
  const handleSortId = useCallback(() => onRequestSort('id'), [onRequestSort]);
  const handleSortName = useCallback(
    () => onRequestSort('name'),
    [onRequestSort]
  );

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={styles.headerCell}>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={handleSortId}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell sx={styles.headerCell}>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={handleSortName}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={styles.headerCell}>Admin</TableCell>
            <TableCell sx={styles.headerCell}>Manager</TableCell>
            <TableCell sx={styles.headerCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((g) => (
            <GroupRow
              key={g.id ?? 'new'}
              group={g}
              onDetails={onDetails}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
