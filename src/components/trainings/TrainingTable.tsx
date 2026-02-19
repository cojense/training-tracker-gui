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
import {
  Edit as EditIcon,
} from '@mui/icons-material';
import { Training } from '~/types/training';

const trainingTableStyles = { minWidth: 650 };

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

  const externalUrl = training.url ?? '#';

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
          sx={{ cursor: 'pointer' }}
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
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={trainingTableStyles} aria-label="training table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={() => onRequestSort('id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'date'}
                direction={orderBy === 'date' ? order : 'asc'}
                onClick={() => onRequestSort('date')}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'title'}
                direction={orderBy === 'title' ? order : 'asc'}
                onClick={() => onRequestSort('title')}
              >
                Training Name
              </TableSortLabel>
            </TableCell>
            <TableCell>External URL</TableCell>
            {isManager && (
              <TableCell>Actions</TableCell>
            )}
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
