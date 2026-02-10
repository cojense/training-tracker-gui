import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UpdateTrainingEventView } from '~/views/UpdateTrainingEventView';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TrainingService } from '~/services/TrainingService';
import { NotificationProvider } from '~/hooks/NotificationContext';
import { vi } from 'vitest';

vi.mock('~/services/TrainingService', () => ({
  TrainingService: {
    getEvent: vi.fn(),
    updateEvent: vi.fn(),
  },
}));

const mockEvent = {
  id: 1,
  user_id: 1,
  completion_date: '2023-01-01',
  comment: 'Old comment',
  certificate_unavailable: false,
  training_certificates: [],
  training: { id: 101, title: 'Safety Training' },
};

describe('UpdateTrainingEventView', () => {
  it('renders existing event data and submits updates', async () => {
    (TrainingService.getEvent as any).mockResolvedValue(mockEvent);
    (TrainingService.updateEvent as any).mockResolvedValue({
      ...mockEvent,
      comment: 'New comment',
    });

    render(
      <MemoryRouter initialEntries={['/events/1/edit']}>
        <NotificationProvider>
          <Routes>
            <Route
              path="/events/:id/edit"
              element={<UpdateTrainingEventView />}
            />
          </Routes>
        </NotificationProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Old comment')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Comments'), {
      target: { value: 'New comment' },
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(TrainingService.updateEvent).toHaveBeenCalled();
    });
  });
});
