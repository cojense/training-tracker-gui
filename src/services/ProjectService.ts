import { Project } from '~/types/projects';
import { apiFetch } from './apiClient';

export const ProjectService = {
  /**
   * Fetches all projects in the system.
   */
  getProjects: () => apiFetch<Project[]>('/projects'),

  /**
   * Fetches a single project by ID.
   */
  getProject: (id: number | string) => apiFetch<Project>(`/projects/${id}`),

  /**
   * Creates a new project.
   */
  createProject: (data: { name: string }) =>
    apiFetch<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Updates an existing project.
   */
  updateProject: (id: number | string, data: { name: string }) =>
    apiFetch<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Deletes a project.
   */
  deleteProject: (id: number | string) =>
    apiFetch<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};
