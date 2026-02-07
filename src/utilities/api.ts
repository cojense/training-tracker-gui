import { Project } from '~/types/projects';
import { User, Group } from '~/types/user';
import { AssignedTraining } from '~/types/assignments';
import { Training, TrainingEvent } from '~/types/training';

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Generic fetch wrapper with credentials enabled for session-based auth.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // Crucial for sending/receiving HttpOnly session cookies
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  const response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    // Handle unauthorized (session expired or not logged in)
    throw new Error('UNAUTHORIZED');
  }

  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(errorData.message ?? `API error: ${response.status}`);
  }

  const data = (await response.json()) as T;
  return data;
}

export const api = {
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
   * Fetches the full list of available trainings.
   */
  getTrainings: () => apiFetch<Training[]>('/trainings'),

  /**
   * Fetches a single training by ID.
   */
  getTraining: (id: number | string) => apiFetch<Training>(`/trainings/${id}`),

  /**
   * Creates a new training course.
   */
  createTraining: (data: Partial<Training>) =>
    apiFetch<Training>('/trainings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Updates an existing training course.
   */
  updateTraining: (id: number | string, data: Partial<Training>) =>
    apiFetch<Training>(`/trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Deletes a training course.
   */
  deleteTraining: (id: number | string) =>
    apiFetch<void>(`/trainings/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Records a new training event (completion). Supports certificate upload via FormData.
   */
  createEvent: (formData: FormData) =>
    apiFetch<TrainingEvent>('/events', {
      method: 'POST',
      body: formData,
    }),

  /**
   * Updates an existing training event. Supports certificate upload via FormData.
   */
  updateEvent: (id: number | string, formData: FormData) =>
    apiFetch<TrainingEvent>(`/events/${id}`, {
      method: 'PUT',
      body: formData,
    }),

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
   * Fetches all groups in the system.
   */
  getGroups: () => apiFetch<Group[]>('/groups'),

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

  /**
   * Fetches all projects in the system.
   */
  getProjects: () => apiFetch<Project[]>('/projects'),

  /**
   * Fetches the approval queue (unapproved trainings).
   */
  getApprovalQueue: () => apiFetch<TrainingEvent[]>('/approvals'),
};
