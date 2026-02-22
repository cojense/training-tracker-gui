import { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  Button,
  TableSortLabel,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Training } from '~/types/training';
import { getSafeUrl } from '~/utilities/urlValidation';

const styles = {
  headerCell: {
    fontWeight: 'bold',
  },
  table: {
    minWidth: 650,
  },
  linkPointer: {
    cursor: 'pointer',
  },
};

interface TrainingRowProps {
  training: Training;
  isManager: boolean;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
}

const TrainingRow = ({
  training,
  isManager,
  onEdit,
  onView,
}: TrainingRowProps) => {
  const handleEdit = useCallback(
    () => onEdit(training.id),
    [training.id, onEdit]
  );
  const handleView = useCallback(
    () => onView(training.id),
    [training.id, onView]
  );

  const externalUrl = getSafeUrl(training.url);

  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        {training.id}
      </TableCell>
      <TableCell>{training.date}</TableCell>
      <TableCell>
        <MuiLink
          onClick={handleView}
          underline="hover"
          sx={styles.linkPointer}
          aria-label="View Details"
        >
          {training.title}
        </MuiLink>
      </TableCell>
      <TableCell>
        <MuiLink
          component="a"
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          {training.url}
        </MuiLink>
      </TableCell>
      {isManager && (
        <TableCell>
          <Button size="small" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

type Order = 'asc' | 'desc';

interface TrainingTableProps {
  trainings: Training[];
  isManager: boolean;
  orderBy: keyof Training;
  order: Order;
  onRequestSort: (property: keyof Training) => void;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
}

export const TrainingTable = ({
  trainings,
  isManager,
  orderBy,
  order,
  onRequestSort,
  onEdit,
  onView,
}: TrainingTableProps) => {
  const handleSortId = useCallback(() => onRequestSort('id'), [onRequestSort]);
  const handleSortDate = useCallback(
    () => onRequestSort('date'),
    [onRequestSort]
  );
  const handleSortTitle = useCallback(
    () => onRequestSort('title'),
    [onRequestSort]
  );

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={styles.table} aria-label="training table">
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
                active={orderBy === 'date'}
                direction={orderBy === 'date' ? order : 'asc'}
                onClick={handleSortDate}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell sx={styles.headerCell}>
              <TableSortLabel
                active={orderBy === 'title'}
                direction={orderBy === 'title' ? order : 'asc'}
                onClick={handleSortTitle}
              >
                Training Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={styles.headerCell}>External URL</TableCell>
            {isManager && <TableCell sx={styles.headerCell}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {trainings.map((training: Training) => (
            <TrainingRow
              key={training.id}
              training={training}
              isManager={isManager}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
