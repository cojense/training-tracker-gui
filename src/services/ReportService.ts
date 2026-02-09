import { AssignedTraining } from '~/types/assignments';
import { apiFetch } from './apiClient';

export const ReportService = {
  /**
   * Fetches the manager report (full system compliance).
   */
  getManagerReport: () => apiFetch<AssignedTraining[]>('/reports/manager'),

  /**
   * Fetches the supervisor report (team compliance).
   */
  getSupervisorReport: () =>
    apiFetch<AssignedTraining[]>('/reports/supervisor'),
};
