import { useEffect, useState, useCallback } from 'react';
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
import {
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { GroupService } from '~/services/GroupService';
import { Group, User } from '~/types/user';
import { Assignment } from '~/types/assignments';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

interface GroupDetailModalProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onEditAssignment: (trainingId: number) => void;
  onAddAssignment: () => void;
}

export const GroupDetailModal = ({ open, onClose, group, onEditAssignment, onAddAssignment }: GroupDetailModalProps) => {
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
  }, [group]);

  useEffect(() => {
    if (open && group) void fetchData();
  }, [open, group, fetchData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
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
      }}>
        <Typography variant="h5" gutterBottom>
          Group Details: {group?.name || ''}
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
              <CardContent sx={{ p: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Training</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((a) => (
                      <TableRow key={a.training.id}>
                        <TableCell>{a.training.title}</TableCell>
                        <TableCell>{a.project.name}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => onEditAssignment(a.training.id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
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
              <CardContent sx={{ p: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.last_name}, {m.first_name}</TableCell>
                        <TableCell>{m.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
