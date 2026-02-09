import { Group } from '~/types/user';
import { User } from '~/types/user';
import { Assignment } from '~/types/assignments';
import { apiFetch } from './apiClient';

export const GroupService = {
  /**
   * Fetches all groups in the system.
   */
  getGroups: () => apiFetch<Group[]>('/groups'),

  /**
   * Fetches a single group by ID.
   */
  getGroup: (id: number | string) => apiFetch<Group>(`/groups/${id}`),

  /**
   * Creates a new group.
   */
  createGroup: (data: Partial<Group>) =>
    apiFetch<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Updates an existing group.
   */
  updateGroup: (id: number | string, data: Partial<Group>) =>
    apiFetch<Group>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Deletes a group.
   */
  deleteGroup: (id: number | string) =>
    apiFetch<void>(`/groups/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Fetches the members of a group.
   */
  getGroupMembers: (id: number | string) =>
    apiFetch<User[]>(`/groups/${id}/members`),

  /**
   * Fetches assignments for a specific group.
   */
  getGroupAssignments: (groupId: number | string) =>
    apiFetch<Assignment[]>(`/groups/${groupId}/assignments`),

  /**
   * Fetches a specific assignment.
   */
  getAssignment: (groupId: number | string, trainingId: number | string) =>
    apiFetch<Assignment>(`/groups/${groupId}/assignments/${trainingId}`),

  /**
   * Creates or updates a group assignment.
   */
  updateAssignment: (
    groupId: number | string,
    trainingId: number | string,
    data: Partial<Assignment> & { project_id?: number | string }
  ) =>
    apiFetch<Assignment>(`/groups/${groupId}/assignments/${trainingId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Deletes a group assignment.
   */
  deleteAssignment: (groupId: number | string, trainingId: number | string) =>
    apiFetch<void>(`/groups/${groupId}/assignments/${trainingId}`, {
      method: 'DELETE',
    }),
};
