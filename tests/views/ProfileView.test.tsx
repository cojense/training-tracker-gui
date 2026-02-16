import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProfileView } from '../../src/views/ProfileView';
import { UserService } from '../../src/services/UserService';
import { NotificationProvider } from '../../src/hooks/NotificationContext';

// Mocks
vi.mock('../../src/services/UserService');
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, first_name: 'John', last_name: 'Doe', is_admin: true },
  }),
}));

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter>
          <ProfileView />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );

describe('ProfileView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(UserService.getCurrentUserAssignments).mockResolvedValue([]);
    vi.mocked(UserService.getCurrentUserGroups).mockResolvedValue([]);
    vi.mocked(UserService.getCurrentUserRecord).mockResolvedValue([]);
  });

  it('should render the profile page', async () => {
    renderComponent();
    expect(await screen.findByText(/user profile/i)).toBeInTheDocument();
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByText('Group Memberships')).toBeInTheDocument();
  });
});
