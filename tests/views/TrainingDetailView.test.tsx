import { render, screen, waitFor } from '@testing-library/react';
import { TrainingDetailView } from '~/views/TrainingDetailView';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TrainingService } from '~/services/TrainingService';
import { AuthProvider } from '~/hooks/useAuth';
import { vi, MockedFunction } from 'vitest';

vi.mock('~/services/TrainingService', () => ({
  TrainingService: {
    getTraining: vi.fn(),
    getTrainingCompletions: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const mockTraining = {
  id: 101,
  title: 'Safety Training',
  date: '2023-01-01',
  description: 'Learn how to be safe.',
  url: 'https://safety.com',
};

const mockCompletions = [
  {
    id: 1,
    user_id: 1,
    completion_date: '2023-01-05',
    approved_date: '2023-01-06',
    comment: 'Good',
    training_certificates: [],
    training: { id: 101, title: 'Safety Training' },
    user: { first_name: 'John', last_name: 'Doe' },
  },
];

describe('TrainingDetailView', () => {
  it('renders training details and completion history', async () => {
    (TrainingService.getTraining as MockedFunction<any>).mockResolvedValue(
      mockTraining
    );
    (
      TrainingService.getTrainingCompletions as MockedFunction<any>
    ).mockResolvedValue(mockCompletions);
    (TrainingService.getCurrentUser as MockedFunction<any>).mockResolvedValue({
      id: 1,
      first_name: 'Test',
      last_name: 'User',
    });

    render(
      <MemoryRouter initialEntries={['/training/101']}>
        <AuthProvider>
          <Routes>
            <Route path="/training/:id" element={<TrainingDetailView />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Safety Training')).toBeInTheDocument();
    });

    expect(screen.getByText('Learn how to be safe.')).toBeInTheDocument();
    expect(screen.getByText('Doe, John')).toBeInTheDocument();
    expect(screen.getByText('2023-01-05')).toBeInTheDocument();
  });
});
