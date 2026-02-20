import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
  Theme,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { AssignedTraining } from '~/types/assignments';
import { exportToCSV } from '~/utilities/csvExport';
import { getStatusBackgroundColor } from '~/utilities/statusColors';
import { SupervisorCard } from './SupervisorCard';

export interface ReportColumn {
  header: string;
  render: (row: AssignedTraining) => React.ReactNode;
}

interface ReportRowProps {
  row: AssignedTraining;
  columns: ReportColumn[];
  theme: Theme;
  rowIndex: number;
}

const ReportRow: React.FC<ReportRowProps> = ({
  row,
  columns,
  theme,
  rowIndex,
}) => {
  const rowStyle = useMemo(
    () => ({
      backgroundColor: getStatusBackgroundColor(row, theme),
    }),
    [row, theme]
  );

  return (
    <TableRow
      key={`${row.member.id}-${row.assignment.training.id}-${rowIndex}`}
      sx={rowStyle}
      hover
    >
      {columns.map((col, colIndex) => (
        <TableCell key={colIndex}>{col.render(row)}</TableCell>
      ))}
    </TableRow>
  );
};

interface ReportCardProps {
  title: string;
  fetchData: () => Promise<AssignedTraining[]>;
  exportFilenamePrefix: string;
  columns: ReportColumn[];
  exportConfig: {
    headers: string[];
    getData: (row: AssignedTraining) => (string | undefined)[];
  };
  emptyMessage?: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  fetchData,
  exportFilenamePrefix,
  columns,
  exportConfig,
  emptyMessage,
}) => {
  const theme = useTheme();
  const [report, setReport] = useState<AssignedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData();
      setReport(data);
    } catch (err) {
      console.error(`Failed to fetch ${title}:`, err);
      setError(`Could not load the ${title}.`);
    } finally {
      setLoading(false);
    }
  }, [fetchData, title]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  const handleExport = useCallback(() => {
    const data = report.map(exportConfig.getData);
    exportToCSV(
      `${exportFilenamePrefix}_${Date.now()}.csv`,
      exportConfig.headers,
      data
    );
  }, [report, exportConfig, exportFilenamePrefix]);

  const headerAction = useMemo(
    () => (
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
    ),
    [handleExport, report.length]
  );

  return (
    <SupervisorCard
      title={title}
      loading={loading}
      error={error}
      headerAction={headerAction}
      empty={report.length === 0}
      emptyMessage={emptyMessage}
    >
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={i}>{col.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {report.map((row, rowIndex) => (
              <ReportRow
                key={`${row.member.id}-${row.assignment.training.id}-${rowIndex}`}
                row={row}
                columns={columns}
                theme={theme}
                rowIndex={rowIndex}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SupervisorCard>
  );
};
