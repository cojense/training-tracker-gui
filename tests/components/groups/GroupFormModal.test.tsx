import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GroupFormModal } from '~/components/groups/GroupFormModal';
import { ComponentProps } from 'react';

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof GroupFormModal>) =>
  render(
    <ThemeProvider theme={theme}>
      <GroupFormModal {...props} />
    </ThemeProvider>
  );

describe('GroupFormModal', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should render form fields', () => {
    renderComponent({
      open: true,
      title: 'Test Title',
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/is admin group/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    renderComponent({
      open: true,
      title: 'Test Title',
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });

    fireEvent.change(screen.getByLabelText(/group name/i), {
      target: { value: 'New Group' },
    });
    fireEvent.click(screen.getByLabelText(/is admin group/i));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Group',
          is_admin: true,
        })
      );
    });
  });
});
