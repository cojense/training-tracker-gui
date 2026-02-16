import { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { ReportService } from '~/services/ReportService';
import { AssignedTraining } from '~/types/assignments';
import { exportToCSV } from '~/utilities/csvExport';
import { getStatusBackgroundColor } from '~/utilities/statusColors';

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

export const ManagerReportCard = () => {
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
