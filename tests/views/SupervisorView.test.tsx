import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SupervisorView } from '../../src/views/SupervisorView';
import { ReportService } from '../../src/services/ReportService';
import { TrainingService } from '../../src/services/TrainingService';
import { exportToCSV } from '../../src/utilities/csvExport';
import { getStatusBackgroundColor } from '../../src/utilities/statusColors';
import { AssignedTraining } from '../../src/types/assignments';

// Mocks
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, first_name: 'Admin', last_name: 'User', is_admin: true },
    isAuthenticated: true,
  }),
}));

vi.mock('../../src/hooks/useNotification', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
  }),
}));

vi.mock('../../src/services/ReportService');
vi.mock('../../src/services/TrainingService');
vi.mock('../../src/utilities/csvExport');
vi.mock('../../src/utilities/statusColors', () => ({
  getStatusBackgroundColor: vi.fn(() => 'transparent'),
}));

const ReportServiceMock = ReportService as any;
const TrainingServiceMock = TrainingService as any;
const exportToCSVMock = exportToCSV as Mock;
const getStatusBackgroundColorMock = getStatusBackgroundColor as Mock;

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <SupervisorView />
      </MemoryRouter>
    </ThemeProvider>
  );

const mockReport: AssignedTraining[] = [
  {
    member: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      is_active: true,
      supervisor_id: 1,
    },
    assignment: {
      group_id: 1,
      training: {
        id: 101,
        title: 'Safety 101',
        date: '2023-01-01',
        description: '',
        url: '',
      },
      project: { id: 1, name: 'Project A' },
      start_date: '2024-01-01',
      end_date: null,
      suspense_date: '',
      cadence: '1 year',
      no_nag: false,
    },
    projects: [{ id: 1, name: 'Project A' }],
    completion_date: '2024-01-15',
    approved_date: '2024-01-20',
    due_date: '2025-01-15',
  },
];

describe('SupervisorView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    TrainingServiceMock.getApprovalQueue.mockResolvedValue([]);
    ReportServiceMock.getManagerReport.mockResolvedValue([]);
    ReportServiceMock.getSupervisorReport.mockResolvedValue([]);
  });

  it('should render loading spinners while fetching data', () => {
    ReportServiceMock.getSupervisorReport.mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('should display an error message if fetching fails', async () => {
    ReportServiceMock.getSupervisorReport.mockRejectedValue(new Error('API Error'));
    renderComponent();
    expect(await screen.findByText('Could not load the supervisor report.')).toBeInTheDocument();
  });

  it('should display a message when there is no report data', async () => {
    ReportServiceMock.getSupervisorReport.mockResolvedValue([]);
    renderComponent();
    expect(await screen.findByText('No pending training for your team members.')).toBeInTheDocument();
  });

  it('should render the report table with data', async () => {
    ReportServiceMock.getSupervisorReport.mockResolvedValue(mockReport);
    renderComponent();

    const memberHeaders = await screen.findAllByRole('columnheader', { name: 'Member' });
    expect(memberHeaders.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Doe, John' })).toBeInTheDocument();
    expect(screen.getByText('Safety 101')).toBeInTheDocument();
  });

  it('should handle CSV export correctly', async () => {
    ReportServiceMock.getSupervisorReport.mockResolvedValue(mockReport);
    renderComponent();

    const exportButtons = await screen.findAllByRole('button', { name: /export csv/i });
    // Find the one in the Supervisor section (last one)
    const exportButton = exportButtons[exportButtons.length - 1];
    fireEvent.click(exportButton);

    expect(exportToCSVMock).toHaveBeenCalled();
  });
});
