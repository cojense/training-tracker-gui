import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ApprovalQueueView } from '../ApprovalQueueView';
import { BrowserRouter } from 'react-router-dom';
import { api } from '~/utilities/api';
import { NotificationProvider } from '~/utilities/NotificationContext';
import { vi } from 'vitest';

vi.mock('~/utilities/api', () => ({
  api: {
    getApprovalQueue: vi.fn(),
    approveEvent: vi.fn(),
  },
}));

const mockQueue = [
  {
    id: 1,
    user_id: 1,
    completion_date: '2023-01-01',
    training: { id: 101, title: 'Safety Training' },
    user: { first_name: 'John', last_name: 'Doe' },
    training_certificates: [],
  },
  {
    id: 2,
    user_id: 2,
    completion_date: '2023-01-02',
    training: { id: 102, title: 'Ethics Training' },
    user: { first_name: 'Jane', last_name: 'Smith' },
    training_certificates: [],
  },
];

describe('ApprovalQueueView', () => {
  it('renders queue and handles bulk approval', async () => {
    (api.getApprovalQueue as any).mockResolvedValue(mockQueue);
    (api.approveEvent as any).mockResolvedValue({ status: 'success' });

    render(
      <BrowserRouter>
        <NotificationProvider>
          <ApprovalQueueView />
        </NotificationProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Doe, John')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    // checkbox[0] is Toggle All, 1 and 2 are for rows
    fireEvent.click(checkboxes[0]); // Select all

    const approveButton = screen.getByText(/Approve Selected/);
    fireEvent.click(approveButton);

    await waitFor(() => {
      // Should call approveEvent twice
      expect(api.approveEvent).toHaveBeenCalledTimes(2);
    });
  });
});
