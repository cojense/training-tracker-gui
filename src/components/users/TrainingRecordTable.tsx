import { useCallback, useMemo } from 'react';
import {
  TableRow,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Link,
  SxProps,
  Theme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '~/services/apiClient';
import { TrainingEvent } from '~/types/training';

const styles = {
  header: { fontWeight: 'bold' },
  certLink: { mr: 1 },
};

interface CertificateLinkProps {
  certId: number;
  index: number;
  sx: SxProps<Theme>;
}

const CertificateLink = ({ certId, index, sx }: CertificateLinkProps) => {
  const label = useMemo(
    () => `certificate${index > 0 ? index + 1 : ''}`,
    [index]
  );

  const href = useMemo(
    () => `${BACKEND_URL}/api/certificates/${certId}`,
    [certId]
  );

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" sx={sx}>
      {label}
    </Link>
  );
};

interface RowProps {
  event: TrainingEvent;
  onEdit: (id: number) => void;
}

const TrainingRecordRow = ({ event, onEdit }: RowProps) => {
  const handleEdit = useCallback(() => {
    if (event.id !== null) {
      onEdit(event.id);
    }
  }, [event.id, onEdit]);

  return (
    <TableRow hover>
      <TableCell>
        {!event.approved_date && event.id !== null && (
          <Tooltip title="Edit Event">
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
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
            <CertificateLink
              key={cert.id ?? index}
              certId={cert.id!}
              index={index}
              sx={styles.certLink}
            />
          ))
        )}
      </TableCell>
    </TableRow>
  );
};

interface TrainingRecordTableProps {
  record: TrainingEvent[];
}

export const TrainingRecordTable = ({ record }: TrainingRecordTableProps) => {
  const navigate = useNavigate();

  const handleEditClick = useCallback(
    (id: number) => {
      void navigate(`/events/${id}/edit`);
    },
    [navigate]
  );

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
            <TableCell sx={styles.header}>Actions</TableCell>
            <TableCell sx={styles.header}>ID</TableCell>
            <TableCell sx={styles.header}>Training</TableCell>
            <TableCell sx={styles.header}>Completed</TableCell>
            <TableCell sx={styles.header}>Approved</TableCell>
            <TableCell sx={styles.header}>Certificates</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {record.map((event: TrainingEvent) => (
            <TrainingRecordRow
              key={event.id ?? 'new'}
              event={event}
              onEdit={handleEditClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
