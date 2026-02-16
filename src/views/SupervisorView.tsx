import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  Checkbox,
  Tooltip,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ReportService } from '~/services/ReportService';
import { TrainingService } from '~/services/TrainingService';
import { AssignedTraining } from '~/types/assignments';
import { TrainingEvent } from '~/types/training';
import { exportToCSV } from '~/utilities/csvExport';
import { getStatusBackgroundColor } from '~/utilities/statusColors';
import { useNotification } from '~/hooks/useNotification';
import { useAuth } from '~/hooks/useAuth';
import { TrainingEventModal } from '~/components/modals/TrainingEventModal';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  headerCell: { fontWeight: 'bold' },
  certLink: { mr: 1 },
};

const ApprovalQueueComponent = () => {
  const { showNotification } = useNotification();
  const [queue, setQueue] = useState<TrainingEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editEvent, setEditEvent] = useState<TrainingEvent | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TrainingService.getApprovalQueue();
      setQueue(data);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to fetch approval queue:', err);
      setError('Could not load the approval queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setSelectedIds(new Set(queue.map((e) => e.id!)));
    else setSelectedIds(new Set());
  }, [queue]);

  const handleApproveOne = useCallback(async (id: number) => {
    try {
      setApproving(true);
      await TrainingService.approveEvent(id);
      showNotification('Training approved.', 'success');
      void fetchQueue();
    } catch (err) {
      console.error('Failed to approve training:', err);
      showNotification('Failed to approve training.', 'error');
    } finally {
      setApproving(false);
    }
  }, [fetchQueue, showNotification]);

  const handleApproveSelected = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      setApproving(true);
      for (const id of ids) await TrainingService.approveEvent(id);
      showNotification(`Successfully approved ${ids.length} records.`, 'success');
      void fetchQueue();
    } catch (err) {
      console.error('Failed to approve selected trainings:', err);
      showNotification('Some approvals may have failed.', 'error');
      void fetchQueue();
    } finally {
      setApproving(false);
    }
  }, [selectedIds, fetchQueue, showNotification]);

  const allSelected = useMemo(
    () => queue.length > 0 && selectedIds.size === queue.length,
    [queue, selectedIds]
  );

  return (
    <Card elevation={2}>
      <Box sx={styles.headerBox}>
        <Typography variant="h6">Training Approval Queue</Typography>
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedIds.size === 0 || approving}
          onClick={() => void handleApproveSelected()}
          size="small"
        >
          Approve Selected ({selectedIds.size})
        </Button>
      </Box>
      <Divider />
      <CardContent sx={styles.contentRoot}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : queue.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selectedIds.size > 0 && selectedIds.size < queue.length}
                      onChange={handleToggleAll}
                    />
                  </TableCell>
                  <TableCell sx={styles.headerCell}>User</TableCell>
                  <TableCell sx={styles.headerCell}>Training</TableCell>
                  <TableCell sx={styles.headerCell}>Date</TableCell>
                  <TableCell sx={styles.headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((event) => (
                  <TableRow key={event.id} hover selected={selectedIds.has(event.id!)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.has(event.id!)}
                        onChange={() => handleToggle(event.id!)}
                      />
                    </TableCell>
                    <TableCell>
                      {event.user ? `${event.user.last_name}, ${event.user.first_name}` : `ID: ${event.user_id}`}
                    </TableCell>
                    <TableCell>{event.training.title}</TableCell>
                    <TableCell>{event.completion_date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => void handleApproveOne(event.id!)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => setEditEvent(event)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={styles.centeredBox}>
            <Typography variant="body1" color="text.secondary">
              The approval queue is empty.
            </Typography>
          </Box>
        )}
      </CardContent>
      <TrainingEventModal
        open={!!editEvent}
        onClose={() => setEditEvent(null)}
        mode="update"
        event={editEvent}
        onSaveSuccess={fetchQueue}
      />
    </Card>
  );
};

const ManagerReportComponent = () => {
  const theme = useTheme();
  const [report, setReport] = useState<AssignedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getManagerReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch manager report:', err);
      setError('Could not load the manager report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  const handleExport = useCallback(() => {
    const headers = ['Member', 'Training', 'Bill To', 'Last Completed', 'Approved', 'Due', 'Supervisor'];
    const data = report.map((row) => [
      `${row.member.last_name}, ${row.member.first_name}`,
      row.assignment.training.title,
      row.projects.map((p) => p.name).join(', '),
      row.completion_date,
      row.approved_date,
      row.due_date,
      row.member.supervisor ? `${row.member.supervisor.last_name}, ${row.member.supervisor.first_name}` : 'MISSING',
    ]);
    exportToCSV(`manager_report_${Date.now()}.csv`, headers, data);
  }, [report]);

  return (
    <Card elevation={2}>
      <Box sx={styles.headerBox}>
        <Typography variant="h6">Manager Report (All Users)</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={report.length === 0}
          size="small"
        >
          Export CSV
        </Button>
      </Box>
      <Divider />
      <CardContent sx={styles.contentRoot}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.headerCell}>Member</TableCell>
                  <TableCell sx={styles.headerCell}>Training</TableCell>
                  <TableCell sx={styles.headerCell}>Bill To</TableCell>
                  <TableCell sx={styles.headerCell}>Due Date</TableCell>
                  <TableCell sx={styles.headerCell}>Supervisor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map((row, index) => (
                  <TableRow
                    key={`${row.member.id}-${row.assignment.training.id}-${index}`}
                    sx={{ backgroundColor: getStatusBackgroundColor(row, theme) }}
                    hover
                  >
                    <TableCell>
                      <MuiLink component={Link} to={`/users/${row.member.id}`} underline="hover">
                        {row.member.last_name}, {row.member.first_name}
                      </MuiLink>
                    </TableCell>
                    <TableCell>{row.assignment.training.title}</TableCell>
                    <TableCell>{row.projects.map((p) => p.name).join(', ')}</TableCell>
                    <TableCell>{row.due_date}</TableCell>
                    <TableCell>
                      {row.member.supervisor ? `${row.member.supervisor.last_name}, ${row.member.supervisor.first_name}` : 'MISSING'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export const SupervisorView = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [report, setReport] = useState<AssignedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getSupervisorReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch supervisor report:', err);
      setError('Could not load the supervisor report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  const handleExport = useCallback(() => {
    const headers = ['Member', 'Training', 'Last Completed', 'Approved', 'Due'];
    const data = report.map((row) => [
      `${row.member.last_name}, ${row.member.first_name}`,
      row.assignment.training.title,
      row.completion_date,
      row.approved_date,
      row.due_date,
    ]);
    exportToCSV(`supervisor_report_${Date.now()}.csv`, headers, data);
  }, [report]);

  return (
    <Stack spacing={3}>
      {isManager && <ApprovalQueueComponent />}
      {user?.is_admin && <ManagerReportComponent />}

      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Supervisor Report (My Team)</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={report.length === 0}
            size="small"
          >
            Export CSV
          </Button>
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
          {loading ? (
            <Box sx={styles.centeredBox}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : report.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.headerCell}>Member</TableCell>
                    <TableCell sx={styles.headerCell}>Training</TableCell>
                    <TableCell sx={styles.headerCell}>Completed</TableCell>
                    <TableCell sx={styles.headerCell}>Approved</TableCell>
                    <TableCell sx={styles.headerCell}>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.map((row, index) => (
                    <TableRow
                      key={`${row.member.id}-${row.assignment.training.id}-${index}`}
                      sx={{ backgroundColor: getStatusBackgroundColor(row, theme) }}
                      hover
                    >
                      <TableCell>
                        <MuiLink component={Link} to={`/users/${row.member.id}`} underline="hover">
                          {row.member.last_name}, {row.member.first_name}
                        </MuiLink>
                      </TableCell>
                      <TableCell>{row.assignment.training.title}</TableCell>
                      <TableCell>{row.completion_date ?? 'Never'}</TableCell>
                      <TableCell>{row.approved_date ?? 'N/A'}</TableCell>
                      <TableCell>{row.due_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={styles.centeredBox}>
              <Typography variant="body1" color="text.secondary">
                No pending training for your team members.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};
