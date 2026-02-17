import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { ReportService } from '~/services/ReportService';
import { ReportCard, ReportColumn } from './ReportCard';
import { AssignedTraining } from '~/types/assignments';

const columns: ReportColumn[] = [
  {
    header: 'Member',
    render: (row: AssignedTraining) => (
      <MuiLink
        component={Link}
        to={`/users/${row.member.id}`}
        underline="hover"
      >
        {row.member.last_name}, {row.member.first_name}
      </MuiLink>
    ),
  },
  {
    header: 'Training',
    render: (row: AssignedTraining) => row.assignment.training.title,
  },
  {
    header: 'Completed',
    render: (row: AssignedTraining) => row.completion_date ?? 'Never',
  },
  {
    header: 'Approved',
    render: (row: AssignedTraining) => row.approved_date ?? 'N/A',
  },
  {
    header: 'Due Date',
    render: (row: AssignedTraining) => row.due_date,
  },
];

const exportConfig = {
  headers: ['Member', 'Training', 'Last Completed', 'Approved', 'Due'],
  getData: (row: AssignedTraining) => [
    `${row.member.last_name}, ${row.member.first_name}`,
    row.assignment.training.title,
    row.completion_date,
    row.approved_date,
    row.due_date,
  ],
};

export const SupervisorReportCard = () => (
  <ReportCard
    title="Supervisor Report (My Team)"
    fetchData={ReportService.getSupervisorReport}
    exportFilenamePrefix="supervisor_report"
    columns={columns}
    exportConfig={exportConfig}
    emptyMessage="No pending training for your team members."
  />
);
