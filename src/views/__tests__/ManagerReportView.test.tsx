import { render, screen, waitFor } from '@testing-library/react';
import { ManagerReportView } from '../ManagerReportView';
import { BrowserRouter } from 'react-router-dom';
import { ReportService } from '~/services/ReportService';
import { vi, MockedFunction } from 'vitest';

vi.mock('~/services/ReportService', () => ({
  ReportService: {
    getManagerReport: vi.fn(),
  },
}));

const mockReport = [
  {
    member: { id: 1, first_name: 'John', last_name: 'Doe' },
    assignment: { training: { id: 101, title: 'Safety' }, no_nag: false },
    completion_date: '2023-01-01',
    approved_date: '2023-01-02',
    due_date: '2024-01-01',
    projects: [{ name: 'Project A' }],
  },
];

describe('ManagerReportView', () => {
  it('renders report and links to profile', async () => {
    (ReportService.getManagerReport as MockedFunction<any>).mockResolvedValue(mockReport);

    render(
      <BrowserRouter>
        <ManagerReportView />
      </BrowserRouter>
    );

    await waitFor(() => {
      const userLink = screen.getByRole('link', { name: 'Doe, John' });
      expect(userLink).toBeInTheDocument();
      expect(userLink).toHaveAttribute('href', '/users/1');
    });

    const trainingLink = screen.getByRole('link', { name: 'Safety' });
    expect(trainingLink).toBeInTheDocument();
    expect(trainingLink).toHaveAttribute('href', '/training/101');
  });
});
