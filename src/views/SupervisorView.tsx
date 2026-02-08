import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Button,
  alpha,
  useTheme,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { api } from '~/utilities/api';
import { AssignedTraining } from '~/types/assignments';
import { exportToCSV } from '~/utilities/csvExport';
import { differenceInDays, parseISO } from 'date-fns';

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
};

export const SupervisorView = () => {
  const theme = useTheme();
  const [report, setReport] = useState<AssignedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSupervisorReport();
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

  const getRowStyles = useCallback(
    (row: AssignedTraining) => {
      if (row.assignment.no_nag) {
        return {
          backgroundColor:
            theme.palette.mode === 'light' ? '#e1f5fe' : '#01579b',
        };
      }
      if (row.due_date) {
        const daysUntilDue = differenceInDays(
          parseISO(row.due_date),
          new Date()
        );
        if (daysUntilDue <= 0) {
          return { backgroundColor: alpha(theme.palette.error.main, 0.2) };
        }
        if (daysUntilDue <= 30) {
          return { backgroundColor: alpha(theme.palette.warning.main, 0.2) };
        }
      }
      return {};
    },
    [theme]
  );

  return (
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
                    sx={getRowStyles(row)}
                    hover
                  >
                    <TableCell>
                      <MuiLink
                        component={Link}
                        to={`/users/${row.member.id}`}
                        underline="hover"
                      >
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
  );
};
