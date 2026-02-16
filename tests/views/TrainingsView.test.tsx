import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TrainingsView } from '../../src/views/TrainingsView';
import { TrainingService } from '../../src/services/TrainingService';
import { GroupService } from '../../src/services/GroupService';
import { ProjectService } from '../../src/services/ProjectService';
import { UserService } from '../../src/services/UserService';
import { NotificationProvider } from '../../src/hooks/NotificationContext';
import { Training } from '../../src/types/training';

// Mocks
vi.mock('../../src/services/TrainingService');
vi.mock('../../src/services/GroupService');
vi.mock('../../src/services/ProjectService');
vi.mock('../../src/services/UserService');
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, is_admin: true, is_training_manager: true },
  }),
}));

const TrainingServiceMock = vi.mocked(TrainingService);
const GroupServiceMock = vi.mocked(GroupService);
const ProjectServiceMock = vi.mocked(ProjectService);
const UserServiceMock = vi.mocked(UserService);

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter>
          <TrainingsView />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );

const mockTrainings: Training[] = [
  {
    id: 101,
    title: 'Safety 101',
    date: '2023-01-01',
    description: 'Basic safety',
    url: 'http://example.com',
  },
];

describe('TrainingsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    TrainingServiceMock.getTrainings.mockResolvedValue(mockTrainings);
    TrainingServiceMock.getTrainingCompletions.mockResolvedValue([]);
    GroupServiceMock.getGroups.mockResolvedValue([]);
    ProjectServiceMock.getProjects.mockResolvedValue([]);
    UserServiceMock.getUsers.mockResolvedValue([]);
  });

  it('should render the trainings list', async () => {
    renderComponent();
    expect(await screen.findByText('Safety 101')).toBeInTheDocument();
  });

  it('should open the create training modal when Create button is clicked', async () => {
    renderComponent();
    const createButton = await screen.findByRole('button', { name: /create/i });
    fireEvent.click(createButton);
    expect(await screen.findByText('Create New Training')).toBeInTheDocument();
  });

  it('should open the detail modal when view icon is clicked', async () => {
    renderComponent();
    const trainingLink = await screen.findByText('Safety 101');
    fireEvent.click(trainingLink);
    expect(await screen.findByText('Training Detail')).toBeInTheDocument();
    expect(screen.getByText('Basic safety')).toBeInTheDocument();
  });
});
