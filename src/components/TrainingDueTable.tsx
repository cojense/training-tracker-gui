import { useCallback, useMemo, useState } from 'react';
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
  Link as MuiLink,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { AssignedTraining } from '~/types/assignments';
import { getStatusBackgroundColor } from '~/utilities/statusColors';
import { TrainingEventModal } from '~/components/trainings/TrainingEventModal';
import { TrainingDetailModal } from '~/components/trainings/TrainingDetailModal';
import { TrainingEditModal } from '~/components/trainings/TrainingEditModal';
import { Training, TrainingEvent } from '~/types/training';

const styles = {
  header: { fontWeight: 'bold' },
  link: { cursor: 'pointer' },
};

interface RowProps {
  assignment: AssignedTraining;
  onRecord: (trainingId: number | string, userId: number | string) => void;
  onView: (training: Training) => void;
}

const TrainingDueRow = ({ assignment, onRecord, onView }: RowProps) => {
  const theme = useTheme();
  const handleRecord = useCallback(() => {
    onRecord(assignment.assignment.training.id, assignment.member.id);
  }, [assignment, onRecord]);

  const handleView = useCallback(() => {
    onView(assignment.assignment.training);
  }, [assignment.assignment.training, onView]);

  const backgroundColor = useMemo(
    () => getStatusBackgroundColor(assignment, theme),
    [assignment, theme]
  );

  const projectNames = useMemo(() => {
    return assignment.projects.map((p) => p.name).join(', ');
  }, [assignment.projects]);

  const rowStyles = useMemo(() => ({ backgroundColor }), [backgroundColor]);

  return (
    <TableRow hover sx={rowStyles}>
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
        <MuiLink
          onClick={handleView}
          underline="hover"
          sx={styles.link}
          aria-label="View Details"
        >
          {assignment.assignment.training.title}
        </MuiLink>
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
  onSaveSuccess?: () => void;
}

export const TrainingDueTable = ({
  assignments = [],
  onSaveSuccess,
}: TrainingDueTableProps) => {
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<
    number | undefined
  >();
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  const [detailTraining, setDetailTraining] = useState<Training | null>(null);
  const [editTraining, setEditTraining] = useState<Training | null>(null);
  const [eventToEdit, setEventToEdit] = useState<TrainingEvent | null>(null);
  const [eventMode, setEventMode] = useState<'create' | 'update'>('create');

  const handleRecordClick = useCallback(
    (trainingId: number | string, userId: number | string) => {
      setEventMode('create');
      setEventToEdit(null);
      setSelectedTrainingId(Number(trainingId));
      setSelectedUserId(Number(userId));
      setEventModalOpen(true);
    },
    []
  );

  const handleViewClick = useCallback((training: Training) => {
    setDetailTraining(training);
  }, []);

  const handleEditFromDetail = useCallback((training: Training) => {
    setDetailTraining(null);
    setEditTraining(training);
  }, []);

  const handleEditEventClick = useCallback((event: TrainingEvent) => {
    setDetailTraining(null);
    setEventMode('update');
    setEventToEdit(event);
    setEventModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEventModalOpen(false);
    setDetailTraining(null);
    setEditTraining(null);
    setEventToEdit(null);
    if (onSaveSuccess) onSaveSuccess();
  }, [onSaveSuccess]);

  const isDetailModalOpen = useMemo(() => !!detailTraining, [detailTraining]);
  const isEditModalOpen = useMemo(() => !!editTraining, [editTraining]);

  return (
    <>
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
                onView={handleViewClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TrainingEventModal
        open={eventModalOpen}
        onClose={handleCloseModal}
        mode={eventMode}
        event={eventToEdit}
        initialTrainingId={selectedTrainingId}
        initialUserId={selectedUserId}
        onSaveSuccess={onSaveSuccess}
      />

      <TrainingDetailModal
        training={detailTraining}
        open={isDetailModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditFromDetail}
        onEditEvent={handleEditEventClick}
      />

      <TrainingEditModal
        training={editTraining}
        open={isEditModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={onSaveSuccess}
      />
    </>
  );
};
