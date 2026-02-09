import { render, screen, waitFor } from '@testing-library/react';
import Profile from '../Profile';
import { MemoryRouter } from 'react-router-dom';
import { UserService } from '~/services/UserService';
import { AuthProvider } from '~/hooks/useAuth';
import { vi, MockedFunction } from 'vitest';

vi.mock('~/services/UserService', () => ({
  UserService: {
    getCurrentUser: vi.fn(),
    getCurrentUserAssignments: vi.fn(),
    getCurrentUserGroups: vi.fn(),
    getCurrentUserRecord: vi.fn(),
  },
}));

const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  is_admin: true,
  is_training_manager: false,
};

describe('Profile', () => {
  it('renders personal profile details', async () => {
    (UserService.getCurrentUser as MockedFunction<any>).mockResolvedValue(mockUser);
    (UserService.getCurrentUserAssignments as MockedFunction<any>).mockResolvedValue(
      []
    );
    (UserService.getCurrentUserGroups as MockedFunction<any>).mockResolvedValue([]);
    (UserService.getCurrentUserRecord as MockedFunction<any>).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });

    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Edit User')).toBeInTheDocument(); // Admin only
  });
});
