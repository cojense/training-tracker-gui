import { render, screen, waitFor } from '@testing-library/react';
import { GroupDetailView } from '~/views/GroupDetailView';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GroupService } from '~/services/GroupService';
import { vi } from 'vitest';
import { AuthProvider } from '~/hooks/useAuth';

vi.mock('~/services/GroupService', () => ({
  GroupService: {
    getGroup: vi.fn(),
    getGroupAssignments: vi.fn(),
    getGroupMembers: vi.fn(),
  },
}));

const mockGroup = {
  id: 1,
  name: 'Admins',
  is_admin: true,
  is_training_manager: false,
};
const mockAssignments = [
  {
    training: { id: 101, title: 'Safety' },
    project: { name: 'Billing' },
    cadence: '1 year',
    no_nag: false,
  },
];
const mockMembers = [
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
];

describe('GroupDetailView', () => {
  it('renders group details, assignments and members', async () => {
    (GroupService.getGroup as any).mockResolvedValue(mockGroup);
    (GroupService.getGroupAssignments as any).mockResolvedValue(
      mockAssignments
    );
    (GroupService.getGroupMembers as any).mockResolvedValue(mockMembers);

    render(
      <MemoryRouter initialEntries={['/groups/1']}>
        <AuthProvider>
          <Routes>
            <Route path="/groups/:id" element={<GroupDetailView />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Group Detail: Admins/)).toBeInTheDocument();
    });

    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('Doe, John')).toBeInTheDocument();
  });
});
