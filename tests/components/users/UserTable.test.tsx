import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UserTable } from '~/components/users/UserTable';
import { User } from '~/types/user';
import { ComponentProps } from 'react';

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof UserTable>) =>
  render(
    <ThemeProvider theme={theme}>
      <UserTable {...props} />
    </ThemeProvider>
  );

const mockUsers: User[] = [
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', is_admin: true, is_training_manager: false },
];

describe('UserTable', () => {
  const mockOnRequestSort = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnGroups = vi.fn();
  const mockOnView = vi.fn();

  it('should render user list', () => {
    renderComponent({
      users: mockUsers,
      orderBy: 'last_name',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onEdit: mockOnEdit,
      onGroups: mockOnGroups,
      onView: mockOnView,
    });

    expect(screen.getByText('Doe, John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onView when view icon is clicked', () => {
    renderComponent({
      users: mockUsers,
      orderBy: 'last_name',
      order: 'asc',
      onRequestSort: mockOnRequestSort,
      onEdit: mockOnEdit,
      onGroups: mockOnGroups,
      onView: mockOnView,
    });

    fireEvent.click(screen.getByLabelText('View Profile'));
    expect(mockOnView).toHaveBeenCalledWith(1);
  });
});
