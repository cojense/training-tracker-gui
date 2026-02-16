import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TrainingTable } from '~/components/trainings/TrainingTable';
import { Training } from '~/types/training';
import { ComponentProps } from 'react';

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof TrainingTable>) =>
  render(
    <ThemeProvider theme={theme}>
      <TrainingTable {...props} />
    </ThemeProvider>
  );

const mockTrainings: Training[] = [
  { id: 1, title: 'Safety 101', date: '2023-01-01', url: 'http://example.com' },
];

describe('TrainingTable', () => {
  const mockOnRequestSort = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnView = vi.fn();

  it('should render training list', () => {
    renderComponent({
      trainings: mockTrainings,
      isManager: true,
      orderBy: 'title',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onEdit: mockOnEdit,
      onView: mockOnView,
    });

    expect(screen.getByText('Safety 101')).toBeInTheDocument();
  });

  it('should call onView when title is clicked', () => {
    renderComponent({
      trainings: mockTrainings,
      isManager: true,
      orderBy: 'title',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onEdit: mockOnEdit,
      onView: mockOnView,
    });

    fireEvent.click(screen.getByText('Safety 101'));
    expect(mockOnView).toHaveBeenCalledWith(1);
  });
});
