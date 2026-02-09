import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
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
  contentRoot: { p: 2 },
  centeredBox: { textAlign: 'center', py: 4 },
  tableHeader: { fontWeight: 'bold' },
};

export const GroupDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [groupData, assignmentsData, membersData] = await Promise.all([
        GroupService.getGroup(id),
        GroupService.getGroupAssignments(id),
        GroupService.getGroupMembers(id),
      ]);
      setGroup(groupData);
      setAssignments(assignmentsData);
      setMembers(membersData);
    } catch (err) {
      console.error('Failed to fetch group details:', err);
      setError('Could not load group details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error ?? 'Group not found'}</Alert>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Group Detail: {group.name}</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/groups/${id}/edit`)}
            size="small"
          >
            Edit Group
          </Button>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          <Typography variant="body1">
            <strong>Admin Group:</strong> {group.is_admin ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body1">
            <strong>Training Manager Group:</strong>{' '}
            {group.is_training_manager ? 'Yes' : 'No'}
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Assigned Training</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/groups/${id}/assignments/new`)}
            size="small"
          >
            Assign Training
          </Button>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {assignments.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.tableHeader}>Actions</TableCell>
                    <TableCell sx={styles.tableHeader}>Training</TableCell>
                    <TableCell sx={styles.tableHeader}>Bill To</TableCell>
                    <TableCell sx={styles.tableHeader}>Cadence</TableCell>
                    <TableCell sx={styles.tableHeader}>No Nag</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((a) => (
                    <TableRow key={a.training.id} hover>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(
                              `/groups/${id}/assignments/${a.training.id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>{a.training.title}</TableCell>
                      <TableCell>{a.project.name}</TableCell>
                      <TableCell>{a.cadence}</TableCell>
                      <TableCell>{a.no_nag ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={styles.centeredBox}>
              <Typography variant="body2" color="text.secondary">
                No training assigned to this group.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Members</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {members.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.tableHeader}>Name</TableCell>
                    <TableCell sx={styles.tableHeader}>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id} hover>
                      <TableCell>
                        {m.last_name}, {m.first_name}
                      </TableCell>
                      <TableCell>{m.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={styles.centeredBox}>
              <Typography variant="body2" color="text.secondary">
                No members in this group.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};
