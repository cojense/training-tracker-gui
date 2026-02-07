import { useCallback, useMemo } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit as EditIcon } from '@mui/icons-material';
import { AssignedTraining } from '~/types/assignments';
import { TrainingDetailsModalButton } from './TrainingDetailsModal';
import { differenceInDays, parseISO } from 'date-fns';

const styles = {
  header: { fontWeight: 'bold' },
};

interface RowProps {
  assignment: AssignedTraining;
  onRecord: (trainingId: number | string, userId: number | string) => void;
}

const TrainingDueRow = ({ assignment, onRecord }: RowProps) => {
  const theme = useTheme();
  const handleRecord = useCallback(() => {
    onRecord(assignment.assignment.training.id, assignment.member.id);
  }, [assignment, onRecord]);

  const backgroundColor = useMemo(() => {
    if (assignment.assignment.no_nag) {
      return theme.palette.mode === 'light' ? '#e1f5fe' : '#01579b'; // Light Blue
    }

    if (assignment.due_date) {
      const daysUntilDue = differenceInDays(
        parseISO(assignment.due_date),
        new Date()
      );
      if (daysUntilDue <= 0) {
        return alpha(theme.palette.error.main, 0.2);
      }
      if (daysUntilDue <= 30) {
        return alpha(theme.palette.warning.main, 0.2);
      }
    }
    return 'inherit';
  }, [assignment, theme]);

  const projectNames = useMemo(() => {
    return assignment.projects.map((p) => p.name).join(', ');
  }, [assignment.projects]);

  return (
    <TableRow hover sx={{ backgroundColor }}>
      <TableCell>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleRecord}
        >
          Record
        </Button>
      </TableCell>
      <TableCell>
        <TrainingDetailsModalButton training={assignment.assignment.training} />
      </TableCell>
      <TableCell>{projectNames}</TableCell>
      <TableCell>{assignment.completion_date ?? 'Never'}</TableCell>
      <TableCell>{assignment.approved_date ?? 'N/A'}</TableCell>
      <TableCell>{assignment.due_date}</TableCell>
    </TableRow>
  );
};

interface TrainingDueTableProps {
  assignments?: AssignedTraining[];
}

export const TrainingDueTable = ({
  assignments = [],
}: TrainingDueTableProps) => {
  const navigate = useNavigate();

  const handleRecordClick = useCallback(
    (trainingId: number | string, userId: number | string) => {
      void navigate(
        `/events/record?training_id=${trainingId}&user_id=${userId}`
      );
    },
    [navigate]
  );

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={styles.header}>Actions</TableCell>
            <TableCell sx={styles.header}>Training Due</TableCell>
            <TableCell sx={styles.header}>Bill To</TableCell>
            <TableCell sx={styles.header}>Last Completed</TableCell>
            <TableCell sx={styles.header}>Approved</TableCell>
            <TableCell sx={styles.header}>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((training) => (
            <TrainingDueRow
              key={training.assignment.training.id}
              assignment={training}
              onRecord={handleRecordClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
