import { render, screen, waitFor } from '@testing-library/react';
import { UserDetailView } from '~/views/UserDetailView';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserService } from '~/services/UserService';
import { AuthProvider } from '~/hooks/useAuth';
import { vi, MockedFunction } from 'vitest';

vi.mock('~/services/UserService', () => ({
  UserService: {
    getUser: vi.fn(),
    getUserAssignments: vi.fn(),
    getUserGroups: vi.fn(),
    getUserRecord: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const mockUser = {
  id: 42,
  first_name: 'Alice',
  last_name: 'Smith',
  email: 'alice@example.com',
  is_admin: false,
  is_training_manager: false,
};

const mockAssignments = [
  {
    assignment: {
      training: { id: 101, title: 'Security 101' },
      frequency: 365,
    },
    member: mockUser,
    due_date: '2024-12-31',
    projects: [],
  },
];

const mockGroups = [{ id: 1, name: 'Engineers' }];

const mockRecord = [
  {
    id: 1,
    user_id: 42,
    completion_date: '2023-01-05',
    approved_date: '2023-01-06',
    training: { id: 101, title: 'Security 101' },
    training_certificates: [],
  },
];

describe('UserDetailView', () => {
  it('renders user details, assignments, groups, and record', async () => {
    (UserService.getUser as MockedFunction<any>).mockResolvedValue(mockUser);
    (UserService.getUserAssignments as MockedFunction<any>).mockResolvedValue(
      mockAssignments
    );
    (UserService.getUserGroups as MockedFunction<any>).mockResolvedValue(
      mockGroups
    );
    (UserService.getUserRecord as MockedFunction<any>).mockResolvedValue(
      mockRecord
    );
    (UserService.getCurrentUser as MockedFunction<any>).mockResolvedValue(
      mockUser
    );

    render(
      <MemoryRouter initialEntries={['/users/42']}>
        <AuthProvider>
          <Routes>
            <Route path="/users/:id" element={<UserDetailView />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('User Detail: Alice Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();

    expect(
      screen.getByText('Current Training Requirements')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Security 101')).toHaveLength(2);
    expect(screen.getByText('2024-12-31')).toBeInTheDocument();

    expect(screen.getByText('Group Memberships')).toBeInTheDocument();
    expect(screen.getByText('Engineers')).toBeInTheDocument();

    expect(screen.getByText('Training Record')).toBeInTheDocument();
    expect(screen.getByText('2023-01-05')).toBeInTheDocument();
  });

  it('renders error message when API fails', async () => {
    (UserService.getUser as MockedFunction<any>).mockRejectedValue(
      new Error('Unauthorized')
    );
    (UserService.getCurrentUser as MockedFunction<any>).mockResolvedValue(
      mockUser
    );

    render(
      <MemoryRouter initialEntries={['/users/42']}>
        <AuthProvider>
          <Routes>
            <Route path="/users/:id" element={<UserDetailView />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Could not load user details/)
      ).toBeInTheDocument();
    });
  });
});
