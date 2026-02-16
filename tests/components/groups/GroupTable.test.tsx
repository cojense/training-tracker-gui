import { ComponentProps } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GroupTable } from '~/components/groups/GroupTable';
import { Group } from '~/types/user';

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof GroupTable>) =>
  render(
    <ThemeProvider theme={theme}>
      <GroupTable {...props} />
    </ThemeProvider>
  );

const mockGroups: Group[] = [
  { id: 1, name: 'Admin Group', is_admin: true, is_training_manager: false },
  { id: 2, name: 'User Group', is_admin: false, is_training_manager: false },
];

describe('GroupTable', () => {
  const mockOnRequestSort = vi.fn();
  const mockOnDetails = vi.fn();
  const mockOnEdit = vi.fn();

  it('should render table headers and rows', () => {
    renderComponent({
      groups: mockGroups,
      orderBy: 'name',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onDetails: mockOnDetails,
      onEdit: mockOnEdit,
    });

    expect(screen.getByText('Admin Group')).toBeInTheDocument();
    expect(screen.getByText('User Group')).toBeInTheDocument();
    expect(screen.getAllByText('Yes').length).toBe(1);
    expect(screen.getAllByText('No').length).toBe(3); // 2 managers, 1 admin (User Group)
  });

  it('should call onDetails when view icon is clicked', () => {
    renderComponent({
      groups: mockGroups,
      orderBy: 'name',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onDetails: mockOnDetails,
      onEdit: mockOnEdit,
    });

    const viewButtons = screen.getAllByLabelText('Details');
    fireEvent.click(viewButtons[0]);
    expect(mockOnDetails).toHaveBeenCalledWith(1);
  });
});
