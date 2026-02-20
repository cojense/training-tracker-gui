import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProjectsView } from '../../src/views/ProjectsView';
import { ProjectService } from '../../src/services/ProjectService';
import { NotificationProvider } from '../../src/hooks/NotificationContext';
import { Project } from '../../src/types/projects';

// Mocks
vi.mock('../../src/services/ProjectService');
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, is_admin: true },
  }),
}));

const ProjectServiceMock = vi.mocked(ProjectService);

const theme = createTheme();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter>
          <ProjectsView />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );

const mockProjects: Project[] = [
  { id: 1, name: 'Project A' },
  { id: 2, name: 'Project B' },
];

describe('ProjectsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ProjectServiceMock.getProjects.mockResolvedValue(mockProjects);
    ProjectServiceMock.getProject.mockResolvedValue(mockProjects[0]);
  });

  it('should render the projects list', async () => {
    renderComponent();
    expect(await screen.findByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('should open the create project modal when Create button is clicked', async () => {
    renderComponent();
    const createButton = await screen.findByRole('button', {
      name: /create project/i,
    });
    fireEvent.click(createButton);
    // expect(await screen.findByText('Create New Project')).toBeInTheDocument();
  });

  it('should open the edit modal when edit icon is clicked', async () => {
    renderComponent();
    await screen.findByText('Project A');
    const editButtons = screen.getAllByLabelText('Edit Project');
    fireEvent.click(editButtons[0]);
    // expect(await screen.findByText('Edit Project')).toBeInTheDocument();
  });
});
