import { render, screen, waitFor } from '@testing-library/react';
import { GroupDetailView } from '../GroupDetailView';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { api } from '~/utilities/api';
import { vi } from 'vitest';
import { AuthProvider } from '~/utilities/useAuth';

vi.mock('~/utilities/api', () => ({
  api: {
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
    (api.getGroup as any).mockResolvedValue(mockGroup);
    (api.getGroupAssignments as any).mockResolvedValue(mockAssignments);
    (api.getGroupMembers as any).mockResolvedValue(mockMembers);

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
