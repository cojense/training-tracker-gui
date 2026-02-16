import { ComponentProps } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProjectDetailModal } from '~/components/projects/ProjectDetailModal';
import { ProjectService } from '~/services/ProjectService';
import { NotificationProvider } from '~/hooks/NotificationContext';
import { Project } from '~/types/projects';

vi.mock('~/services/ProjectService');
vi.mock('~/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, is_admin: true },
  }),
}));

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof ProjectDetailModal>) =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <ProjectDetailModal {...props} />
      </NotificationProvider>
    </ThemeProvider>
  );

const mockProject: Project = { id: 1, name: 'Project A' };

describe('ProjectDetailModal', () => {
  const mockOnClose = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ProjectService.getProject).mockResolvedValue(mockProject);
  });

  it('should render project details when open', async () => {
    renderComponent({ open: true, onClose: mockOnClose, project: mockProject, onEdit: mockOnEdit });
    expect(await screen.findByText('Project Detail')).toBeInTheDocument();
    expect(screen.getByText('Project A')).toBeInTheDocument();
  });
});
