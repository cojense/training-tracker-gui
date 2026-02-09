import { User, Group } from '~/types/user';
import { AssignedTraining } from '~/types/assignments';
import { TrainingEvent } from '~/types/training';
import { apiFetch } from './apiClient';

export const UserService = {
  /**
   * Fetches the current authenticated user's profile.
   */
  getCurrentUser: () => apiFetch<User>('/users/me'),

  /**
   * Fetches the due trainings for the current authenticated user.
   */
  getCurrentUserAssignments: () =>
    apiFetch<AssignedTraining[]>('/users/me/assignments'),

  /**
   * Fetches the due trainings for a specific user.
   */
  getUserAssignments: (id: number | string) =>
    apiFetch<AssignedTraining[]>(`/users/${id}/assignments`),

  /**
   * Fetches the groups for the current authenticated user.
   */
  getCurrentUserGroups: () => apiFetch<Group[]>('/users/me/groups'),

  /**
   * Fetches the groups for a specific user.
   */
  getUserGroups: (id: number | string) =>
    apiFetch<Group[]>(`/users/${id}/groups`),

  /**
   * Fetches the training record for the current authenticated user.
   */
  getCurrentUserRecord: () => apiFetch<TrainingEvent[]>('/users/me/record'),

  /**
   * Fetches the training record for a specific user.
   */
  getUserRecord: (id: number | string) =>
    apiFetch<TrainingEvent[]>(`/users/${id}/record`),

  /**
   * Fetches all users in the system (Admin/Manager only).
   */
  getUsers: () => apiFetch<User[]>('/users'),

  /**
   * Fetches a single user by ID.
   */
  getUser: (id: number | string) => apiFetch<User>(`/users/${id}`),

  /**
   * Updates a user's profile.
   */
  updateUser: (id: number | string, data: Partial<User>) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Updates a user's group memberships.
   */
  updateUserGroups: (
    user_id: number | string,
    groupStates: Record<number, boolean>
  ) =>
    apiFetch<{ status: string }>(`/users/${user_id}/groups`, {
      method: 'POST',
      body: JSON.stringify(groupStates),
    }),
};
