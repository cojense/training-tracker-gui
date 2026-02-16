import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProjectEditModal } from '~/components/projects/ProjectEditModal';
import { ProjectService } from '~/services/ProjectService';
import { NotificationProvider } from '~/hooks/NotificationContext';
import { Project } from '~/types/projects';
import { ComponentProps } from 'react';

vi.mock('~/services/ProjectService');

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof ProjectEditModal>) =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <ProjectEditModal {...props} />
      </NotificationProvider>
    </ThemeProvider>
  );

const mockProject: Project = { id: 1, name: 'Project A' };

describe('ProjectEditModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSaveSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ProjectService.getProject).mockResolvedValue(mockProject);
  });

  it('should render the modal when open and fetch project data', async () => {
    renderComponent({ open: true, onClose: mockOnClose, project: mockProject, onSaveSuccess: mockOnSaveSuccess });
    expect(await screen.findByDisplayValue('Project A')).toBeInTheDocument();
  });

  it('should call updateProject and onSaveSuccess on valid submit', async () => {
    vi.mocked(ProjectService.updateProject).mockResolvedValue({ ...mockProject, name: 'Updated Name' });
    
    renderComponent({ open: true, onClose: mockOnClose, project: mockProject, onSaveSuccess: mockOnSaveSuccess });
    
    const input = await screen.findByDisplayValue('Project A');
    fireEvent.change(input, { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(ProjectService.updateProject).toHaveBeenCalledWith("1", { name: 'Updated Name' });
      expect(mockOnSaveSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should open delete confirmation dialog when delete is clicked', async () => {
    renderComponent({ open: true, onClose: mockOnClose, project: mockProject, onSaveSuccess: mockOnSaveSuccess });
    
    const deleteBtn = await screen.findByRole('button', { name: /delete project/i });
    fireEvent.click(deleteBtn);
    
    expect(screen.getByText('Delete Project?')).toBeInTheDocument();
  });
});
