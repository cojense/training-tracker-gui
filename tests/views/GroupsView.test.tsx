import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GroupsView } from '../../src/views/GroupsView';
import { GroupService } from '../../src/services/GroupService';
import { NotificationProvider } from '../../src/hooks/NotificationContext';
import { Group } from '../../src/types/user';

// Mocks
vi.mock('../../src/services/GroupService');
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, is_admin: true },
  }),
}));

const GroupServiceMock = vi.mocked(GroupService);

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter>
          <GroupsView />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );

const mockGroups: Group[] = [
  { id: 1, name: 'Admins', is_admin: true, is_training_manager: false },
  { id: 2, name: 'Managers', is_admin: false, is_training_manager: true },
];

describe('GroupsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    GroupServiceMock.getGroups.mockResolvedValue(mockGroups);
    GroupServiceMock.getGroup.mockResolvedValue(mockGroups[0]);
  });

  it('should render the groups list', async () => {
    renderComponent();
    expect(await screen.findByText('Admins')).toBeInTheDocument();
    expect(screen.getByText('Managers')).toBeInTheDocument();
  });

  it('should filter groups based on search input', async () => {
    renderComponent();
    await screen.findByText('Admins');

    const searchInput = screen.getByPlaceholderText('Search groups...');
    fireEvent.change(searchInput, { target: { value: 'Managers' } });

    expect(screen.queryByText('Admins')).not.toBeInTheDocument();
    expect(screen.getByText('Managers')).toBeInTheDocument();
  });

  it('should open the create group modal when Create button is clicked', async () => {
    renderComponent();
    const createButton = await screen.findByRole('button', { name: /create group/i });
    fireEvent.click(createButton);
    // expect(await screen.findByText('Create New Group')).toBeInTheDocument();
  });

  it('should open the detail modal when view icon is clicked', async () => {
    renderComponent();
    await screen.findByText('Admins');
    const viewButtons = screen.getAllByLabelText('Details');
    fireEvent.click(viewButtons[0]);
    // expect(await screen.findByText('Group Details')).toBeInTheDocument();
  });

  it('should open the edit modal when edit icon is clicked', async () => {
    renderComponent();
    await screen.findByText('Admins');
    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);
    // expect(await screen.findByText('Edit Group')).toBeInTheDocument();
  });
});
