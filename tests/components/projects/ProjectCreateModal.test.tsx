import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProjectCreateModal } from '~/components/projects/ProjectCreateModal';
import { ProjectService } from '~/services/ProjectService';
import { NotificationProvider } from '~/hooks/NotificationContext';
import { ComponentProps } from 'react';

vi.mock('~/services/ProjectService');

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof ProjectCreateModal>) =>
  render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <ProjectCreateModal {...props} />
      </NotificationProvider>
    </ThemeProvider>
  );

describe('ProjectCreateModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSaveSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal when open', () => {
    renderComponent({ open: true, onClose: mockOnClose, onSaveSuccess: mockOnSaveSuccess });
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });

  it('should call onClose when cancel is clicked', () => {
    renderComponent({ open: true, onClose: mockOnClose, onSaveSuccess: mockOnSaveSuccess });
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call createProject and onSaveSuccess on valid submit', async () => {
    vi.mocked(ProjectService.createProject).mockResolvedValue({ id: 3, name: 'New Project' });
    
    renderComponent({ open: true, onClose: mockOnClose, onSaveSuccess: mockOnSaveSuccess });
    
    fireEvent.change(screen.getByLabelText(/project name/i), { target: { value: 'New Project' } });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(ProjectService.createProject).toHaveBeenCalledWith({ name: 'New Project' });
      expect(mockOnSaveSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
