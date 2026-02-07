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

  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // Crucial for sending/receiving HttpOnly session cookies
    headers: {
      'Content-Type': 'application/json',
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

  return response.json() as Promise<T>;
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
   * Creates a new training.
   */
  createTraining: (data: Partial<Training>) =>
    apiFetch<Training>('/trainings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Updates an existing training.
   */
  updateTraining: (id: number | string, data: Partial<Training>) =>
    apiFetch<Training>(`/trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Deletes a training.
   */
  deleteTraining: (id: number | string) =>
    apiFetch<void>(`/trainings/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Fetches the groups for the current authenticated user.
   */
  getCurrentUserGroups: () => apiFetch<Group[]>('/users/me/groups'),

  /**
   * Fetches the training record for the current authenticated user.
   */
  getCurrentUserRecord: () => apiFetch<TrainingEvent[]>('/users/me/record'),

  /**
   * Fetches all users in the system (Admin/Manager only).
   */
  getUsers: () => apiFetch<User[]>('/users'),

  /**
   * Fetches all groups in the system.
   */
  getGroups: () => apiFetch<Group[]>('/groups'),

  /**
   * Fetches all projects in the system.
   */
  getProjects: () => apiFetch<Project[]>('/projects'),

  /**
   * Fetches the approval queue (unapproved trainings).
   */
  getApprovalQueue: () => apiFetch<TrainingEvent[]>('/approvals'),
};
