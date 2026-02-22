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
    header: 'Bill To',
    render: (row: AssignedTraining) =>
      row.projects.map((p) => p.name).join(', '),
  },
  {
    header: 'Due Date',
    render: (row: AssignedTraining) => row.due_date,
  },
  {
    header: 'Supervisor',
    render: (row: AssignedTraining) =>
      row.member.supervisor
        ? `${row.member.supervisor.last_name}, ${row.member.supervisor.first_name}`
        : 'MISSING',
  },
];

const exportConfig = {
  headers: [
    'Member',
    'Training',
    'Bill To',
    'Last Completed',
    'Approved',
    'Due',
    'Supervisor',
  ],
  getData: (row: AssignedTraining) => [
    `${row.member.last_name}, ${row.member.first_name}`,
    row.assignment.training.title,
    row.projects.map((p) => p.name).join(', '),
    row.completion_date,
    row.approved_date,
    row.due_date,
    row.member.supervisor
      ? `${row.member.supervisor.last_name}, ${row.member.supervisor.first_name}`
      : 'MISSING',
  ],
};

export const ManagerReportCard = () => (
  <ReportCard
    title="Manager Report (All Users)"
    fetchData={ReportService.getManagerReport}
    exportFilenamePrefix="manager_report"
    columns={columns}
    exportConfig={exportConfig}
  />
);
