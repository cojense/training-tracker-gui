import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit as EditIcon } from '@mui/icons-material';
import { AssignedTraining } from '~/types/assignments';
import { TrainingDetailsModalButton } from './TrainingDetailsModal';
import { useCallback } from 'react';

interface TrainingDueTableProps {
  assignments?: AssignedTraining[];
}
export const TrainingDueTable = ({
  assignments = [],
}: TrainingDueTableProps) => {
  const navigate = useNavigate();

  const handleRecordClick = useCallback(() => {
    void navigate('/events/record');
  }, [navigate]);

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Training Due</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Bill To</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Last Completed</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Approved</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((training: AssignedTraining) => (
            <TableRow key={training.assignment.training.id}>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleRecordClick}
                >
                  Record
                </Button>
              </TableCell>
              <TableCell>
                <TrainingDetailsModalButton
                  training={training.assignment.training}
                />
              </TableCell>
              <TableCell>{training.assignment.project.name}</TableCell>
              <TableCell>{training.completion_date ?? 'Never'}</TableCell>
              <TableCell>{training.approved_date ?? 'N/A'}</TableCell>
              <TableCell>{training.due_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
