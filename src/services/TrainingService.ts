import { Training, TrainingEvent } from '~/types/training';
import { apiFetch } from './apiClient';

export const TrainingService = {
  /**
   * Fetches the full list of available trainings.
   */
  getTrainings: () => apiFetch<Training[]>('/trainings'),

  /**
   * Fetches a single training by ID.
   */
  getTraining: (id: number | string) => apiFetch<Training>(`/trainings/${id}`),

  /**
   * Fetches all completion events for a specific training.
   */
  getTrainingCompletions: (id: number | string) =>
    apiFetch<TrainingEvent[]>(`/trainings/${id}/completions`),

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
   * Fetches a single training event by ID.
   */
  getEvent: (id: number | string) => apiFetch<TrainingEvent>(`/events/${id}`),

  /**
   * Updates an existing training event. Supports certificate upload via FormData.
   */
  updateEvent: (id: number | string, formData: FormData) =>
    apiFetch<TrainingEvent>(`/events/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  /**
   * Fetches the approval queue (unapproved trainings).
   */
  getApprovalQueue: () => apiFetch<TrainingEvent[]>('/approvals'),

  /**
   * Approves a training event.
   */
  approveEvent: (id: number | string) =>
    apiFetch<{ status: string }>(`/approvals/${id}`, {
      method: 'POST',
    }),
};
