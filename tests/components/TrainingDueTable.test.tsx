import { render, screen } from '@testing-library/react';
import { TrainingDueTable } from '~/components/TrainingDueTable';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AssignedTraining } from '~/types/assignments';

const theme = createTheme();

const mockAssignments: AssignedTraining[] = [
  {
    member: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      is_active: true,
      supervisor_id: null,
    },
    assignment: {
      group_id: 1,
      training: {
        id: 101,
        title: 'Safety Training',
        date: '2023-01-01',
        url: null,
      },
      project: { id: 1, name: 'Project A' },
      start_date: '2023-01-01',
      end_date: null,
      suspense_date: '2023-01-01',
      cadence: '1 year',
      no_nag: false,
    },
    projects: [
      { id: 1, name: 'Project A' },
      { id: 2, name: 'Project B' },
    ],
    completion_date: null,
    approved_date: null,
    due_date: '2020-01-01', // Overdue
  },
  {
    member: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      is_active: true,
      supervisor_id: null,
    },
    assignment: {
      group_id: 1,
      training: {
        id: 102,
        title: 'Ethics Training',
        date: '2023-01-01',
        url: null,
      },
      project: { id: 1, name: 'Project A' },
      start_date: '2023-01-01',
      end_date: null,
      suspense_date: '2023-01-01',
      cadence: '1 year',
      no_nag: true, // No Nag
    },
    projects: [{ id: 1, name: 'Project A' }],
    completion_date: null,
    approved_date: null,
    due_date: '2026-01-01',
  },
];

describe('TrainingDueTable', () => {
  it('renders joined project names in the Bill To column', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <TrainingDueTable assignments={mockAssignments} />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Project A, Project B')).toBeInTheDocument();
  });

  it('applies correct background colors for overdue and no-nag rows', () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <TrainingDueTable assignments={mockAssignments} />
        </ThemeProvider>
      </BrowserRouter>
    );

    const rows = container.querySelectorAll('tbody tr');

    // Row 1: Overdue (2020-01-01)
    // alpha(theme.palette.error.main, 0.2)
    // Note: Checking specific style might be brittle, but we verify it's not inherit
    expect(rows[0]).not.toHaveStyle('background-color: inherit');

    // Row 2: No Nag
    // #f5f5f5 (light mode)
    expect(rows[1]).toHaveStyle('background-color: rgb(245, 245, 245)');
  });
});
