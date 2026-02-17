import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HomeView } from '../../src/views/HomeView';
import { UserService } from '../../src/services/UserService';
import { NotificationProvider } from '../../src/hooks/NotificationContext';

// Mocks
vi.mock('../../src/services/UserService');
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, first_name: 'John', last_name: 'Doe' },
  }),
}));

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter>
          <HomeView />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(UserService.getCurrentUserAssignments).mockResolvedValue([]);
  });

  it('should render the welcome message', async () => {
    renderComponent();
    expect(await screen.findByText(/welcome, john doe!/i)).toBeInTheDocument();
  });

  it('should render the training requirements card', async () => {
    renderComponent();
    expect(
      await screen.findByText('Your Training Requirements')
    ).toBeInTheDocument();
  });
});
