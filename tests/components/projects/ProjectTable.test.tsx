import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProjectTable } from '~/components/projects/ProjectTable';
import { Project } from '~/types/projects';
import { ComponentProps } from 'react';

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof ProjectTable>) =>
  render(
    <ThemeProvider theme={theme}>
      <ProjectTable {...props} />
    </ThemeProvider>
  );

const mockProjects: Project[] = [
  { id: 1, name: 'Project A' },
  { id: 2, name: 'Project B' },
];

describe('ProjectTable', () => {
  const mockOnRequestSort = vi.fn();
  const mockOnDetails = vi.fn();
  const mockOnEdit = vi.fn();

  it('should render table headers and rows', () => {
    renderComponent({
      projects: mockProjects,
      orderBy: 'name',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onDetails: mockOnDetails,
      onEdit: mockOnEdit,
    });

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should call onDetails when view icon is clicked', () => {
    renderComponent({
      projects: mockProjects,
      orderBy: 'name',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onDetails: mockOnDetails,
      onEdit: mockOnEdit,
    });

    const viewButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(viewButtons[0]);
    expect(mockOnDetails).toHaveBeenCalledWith(1);
  });
});
