import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { AssignedTraining } from '~/types/assignments';
import { TrainingDetailsModalButton } from './TrainingDetailsModal';

interface TrainingDueTableProps {
  assignments?: AssignedTraining[];
}
export const TrainingDueTable = ({
  assignments = [],
}: TrainingDueTableProps) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Training Due</TableCell>
            <TableCell>Bill To</TableCell>
            <TableCell>Last Completed</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((training: AssignedTraining) => (
            <TableRow key={training.assignment.training.id}>
              <TableCell>[Record]</TableCell>
              <TableCell>
                <TrainingDetailsModalButton
                  training={training.assignment.training}
                />
              </TableCell>
              <TableCell>{training.assignment.project.name}</TableCell>
              <TableCell>{training.completion_date}</TableCell>
              <TableCell>{training.approved_date}</TableCell>
              <TableCell>{training.due_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
