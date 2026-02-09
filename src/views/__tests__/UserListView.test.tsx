import { render, screen, waitFor } from '@testing-library/react';
import { UserListView } from '../UserListView';
import { MemoryRouter } from 'react-router-dom';
import { UserService } from '~/services/UserService';
import { vi, MockedFunction } from 'vitest';

vi.mock('~/services/UserService', () => ({
  UserService: {
    getUsers: vi.fn(),
  },
}));

const mockUsers = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    is_admin: true,
    is_training_manager: false,
  },
];

describe('UserListView', () => {
  it('renders user directory and links to profile', async () => {
    (UserService.getUsers as MockedFunction<any>).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <UserListView />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButton = screen.getByRole('link', { name: /view profile/i });
    expect(viewButton).toBeInTheDocument();
    expect(viewButton).toHaveAttribute('href', '/users/1');
  });
});
