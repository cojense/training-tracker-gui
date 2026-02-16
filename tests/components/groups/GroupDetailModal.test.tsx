import { ComponentProps } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GroupDetailModal } from '~/components/groups/GroupDetailModal';
import { GroupService } from '~/services/GroupService';
import { Group } from '~/types/user';

vi.mock('~/services/GroupService');

const theme = createTheme();

const renderComponent = (props: ComponentProps<typeof GroupDetailModal>) =>
  render(
    <ThemeProvider theme={theme}>
      <GroupDetailModal {...props} />
    </ThemeProvider>
  );

const mockGroup: Group = { id: 1, name: 'Admin Group', is_admin: true, is_training_manager: false };

describe('GroupDetailModal', () => {
  const mockOnClose = vi.fn();
  const mockOnEditAssignment = vi.fn();
  const mockOnAddAssignment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GroupService.getGroupAssignments).mockResolvedValue([]);
    vi.mocked(GroupService.getGroupMembers).mockResolvedValue([]);
  });

  it('should render group details', async () => {
    renderComponent({
      open: true,
      onClose: mockOnClose,
      group: mockGroup,
      onEditAssignment: mockOnEditAssignment,
      onAddAssignment: mockOnAddAssignment
    });

    expect(await screen.findByText(/group details: admin group/i)).toBeInTheDocument();
    expect(screen.getByText('Assignments')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
  });
});
