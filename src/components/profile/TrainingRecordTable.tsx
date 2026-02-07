import {
  TableRow,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Link,
} from '@mui/material';
import { TrainingEvent } from '~/types/training';

interface TrainingRecordTableProps {
  record: TrainingEvent[];
}
export const TrainingRecordTable = ({ record }: TrainingRecordTableProps) => {
  if (!record || record.length === 0) {
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center">No training records found.</TableCell>
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
            <TableCell sx={{ fontWeight: 'bold' }}>Training</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Completed</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Approved</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Certificates</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {record.map((event: TrainingEvent) => (
            <TableRow key={event.id}>
              <TableCell>{event.training.id}</TableCell>
              <TableCell>{event.training.title}</TableCell>
              <TableCell>{event.completion_date}</TableCell>
              <TableCell>{event.approved_date ?? 'Pending'}</TableCell>
              <TableCell>
                {event.certificate_unavailable ? (
                  <i>unavailable</i>
                ) : event.training_certificates.length === 0 ? (
                  <b>missing</b>
                ) : (
                  event.training_certificates.map((cert, index) => (
                    <Link
                      key={cert.id}
                      href={`http://localhost:5001/api/certificates/${cert.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mr: 1 }}
                    >
                      certificate{index > 0 ? index + 1 : ''}
                    </Link>
                  ))
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
