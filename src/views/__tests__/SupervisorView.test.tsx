import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SupervisorView } from '../SupervisorView';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~/utilities/api';
import { vi } from 'vitest';
import * as csvExport from '~/utilities/csvExport';

vi.mock('~/utilities/api', () => ({
  api: {
    getSupervisorReport: vi.fn(),
  },
}));

vi.mock('~/utilities/csvExport', () => ({
  exportToCSV: vi.fn(),
}));

const mockReport = [
  {
    member: { id: 1, first_name: 'John', last_name: 'Doe' },
    assignment: { training: { title: 'Safety' }, no_nag: false },
    completion_date: '2023-01-01',
    approved_date: '2023-01-02',
    due_date: '2024-01-01',
    projects: [],
  },
];

describe('SupervisorView', () => {
  it('renders report and handles export', async () => {
    (api.getSupervisorReport as any).mockResolvedValue(mockReport);

    render(
      <BrowserRouter>
        <SupervisorView />
      </BrowserRouter>
    );

    await waitFor(() => {
      const userLink = screen.getByRole('link', { name: 'Doe, John' });
      expect(userLink).toBeInTheDocument();
      expect(userLink).toHaveAttribute('href', '/users/1');
    });

    const exportButton = screen.getByText(/Export CSV/);
    fireEvent.click(exportButton);

    expect(csvExport.exportToCSV).toHaveBeenCalled();
  });
});
