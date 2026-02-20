import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UsersView } from '../../src/views/UsersView';
import { UserService } from '../../src/services/UserService';
import { GroupService } from '../../src/services/GroupService';
import { NotificationProvider } from '../../src/hooks/NotificationContext';
import { User, Group } from '../../src/types/user';

// Mocks
vi.mock('../../src/services/UserService');
vi.mock('../../src/services/GroupService');
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, is_admin: true },
  }),
}));

const UserServiceMock = vi.mocked(UserService);
const GroupServiceMock = vi.mocked(GroupService);

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter>
          <UsersView />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );

const mockUsers: User[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@test.com',
    is_active: true,
    is_admin: true,
    is_training_manager: false,
    supervisor_id: 1,
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@test.com',
    is_active: true,
    is_admin: false,
    is_training_manager: true,
    supervisor_id: 1,
  },
];

const mockGroups: Group[] = [
  { id: 1, name: 'Admins', is_admin: true, is_training_manager: false },
  { id: 2, name: 'Managers', is_admin: false, is_training_manager: true },
];

describe('UsersView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    UserServiceMock.getUsers.mockResolvedValue(mockUsers);
    GroupServiceMock.getGroups.mockResolvedValue(mockGroups);
    UserServiceMock.getUserGroups.mockResolvedValue([]);
    UserServiceMock.getUserAssignments.mockResolvedValue([]);
    UserServiceMock.getUserRecord.mockResolvedValue([]);
  });

  it('should render the user directory with data', async () => {
    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    expect(await screen.findByText('Doe, John')).toBeInTheDocument();
    expect(screen.getByText('Smith, Jane')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
  });

  it('should filter users based on search input', async () => {
    renderComponent();
    await screen.findByText('Doe, John');

    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(screen.queryByText('Doe, John')).not.toBeInTheDocument();
    expect(screen.getByText('Smith, Jane')).toBeInTheDocument();
  });

  it('should open the user detail modal when view icon is clicked', async () => {
    renderComponent();
    await screen.findByText('Doe, John');

    const viewButtons = screen.getAllByLabelText('View Profile');
    fireEvent.click(viewButtons[0]);

    expect(
      await screen.findByText('User Detail: John Doe')
    ).toBeInTheDocument();
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
  });

  it('should open the edit user modal when edit icon is clicked', async () => {
    renderComponent();
    await screen.findByText('Doe, John');

    const editButtons = screen.getAllByLabelText('Edit Profile');
    fireEvent.click(editButtons[0]);

    expect(await screen.findByText('Edit User Profile')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
  });

  it('should open the group membership modal when groups icon is clicked', async () => {
    renderComponent();
    await screen.findByText('Doe, John');

    const groupButtons = screen.getAllByLabelText('Change Groups');
    fireEvent.click(groupButtons[0]);

    expect(
      await screen.findByText('Change Group Membership')
    ).toBeInTheDocument();
    expect(screen.getByText(/For user: John Doe/)).toBeInTheDocument();
    expect(await screen.findByLabelText('Admins')).toBeInTheDocument();
  });
});
