import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  Modal,
  Button,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { GroupService } from '~/services/GroupService';
import { Group, User } from '~/types/user';
import { Assignment } from '~/types/assignments';

const styles = {
  modalContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 800 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCell: { fontWeight: 'bold' },
  cardContent: { p: 0 },
  actionContainer: {
    mt: 3,
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

interface AssignmentRowProps {
  assignment: Assignment;
  onEdit: (trainingId: number) => void;
}

const AssignmentRow = ({ assignment, onEdit }: AssignmentRowProps) => {
  const handleEdit = useCallback(
    () => onEdit(assignment.training.id),
    [assignment.training.id, onEdit]
  );

  return (
    <TableRow key={assignment.training.id}>
      <TableCell>{assignment.training.title}</TableCell>
      <TableCell>{assignment.project.name}</TableCell>
      <TableCell>
        <IconButton size="small" onClick={handleEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

interface MemberRowProps {
  member: User;
}

const MemberRow = ({ member }: MemberRowProps) => {
  return (
    <TableRow key={member.id}>
      <TableCell>
        {member.last_name}, {member.first_name}
      </TableCell>
      <TableCell>{member.email}</TableCell>
    </TableRow>
  );
};

interface GroupDetailModalProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onEditAssignment: (trainingId: number) => void;
  onAddAssignment: () => void;
}

export const GroupDetailModal = ({
  open,
  onClose,
  group,
  onEditAssignment,
  onAddAssignment,
}: GroupDetailModalProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!group?.id) return;
    try {
      setLoading(true);
      const [assignData, membersData] = await Promise.all([
        GroupService.getGroupAssignments(group.id),
        GroupService.getGroupMembers(group.id),
      ]);
      setAssignments(assignData);
      setMembers(membersData);
    } catch (err) {
      console.error('Failed to fetch group details:', err);
    } finally {
      setLoading(false);
    }
  }, [group?.id]);

  useEffect(() => {
    if (open && group) {
      void fetchData();
    }
  }, [open, group, fetchData]);

  const groupDetailsTitle = useMemo(
    () => `Group Details: ${group?.name ?? ''}`,
    [group?.name]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalContainer}>
        <Typography variant="h5" gutterBottom>
          {groupDetailsTitle}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Stack spacing={3}>
            <Card variant="outlined">
              <Box sx={styles.headerBox}>
                <Typography variant="h6">Assignments</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onAddAssignment}
                >
                  Assign Training
                </Button>
              </Box>
              <Divider />
              <CardContent sx={styles.cardContent}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.headerCell}>Training</TableCell>
                      <TableCell sx={styles.headerCell}>Project</TableCell>
                      <TableCell sx={styles.headerCell}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((a) => (
                      <AssignmentRow
                        key={a.training.id}
                        assignment={a}
                        onEdit={onEditAssignment}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <Box sx={styles.headerBox}>
                <Typography variant="h6">Members</Typography>
              </Box>
              <Divider />
              <CardContent sx={styles.cardContent}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.headerCell}>Name</TableCell>
                      <TableCell sx={styles.headerCell}>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((m) => (
                      <MemberRow key={m.id} member={m} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        )}

        <Box sx={styles.actionContainer}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
