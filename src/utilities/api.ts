import { UserService } from '~/services/UserService';
import { TrainingService } from '~/services/TrainingService';
import { GroupService } from '~/services/GroupService';
import { ProjectService } from '~/services/ProjectService';
import { ReportService } from '~/services/ReportService';

/**
 * Legacy monolithic API object for backward compatibility during migration.
 * @deprecated Use domain-specific services from '~/services/' instead.
 */
export const api = {
  ...UserService,
  ...TrainingService,
  ...GroupService,
  ...ProjectService,
  ...ReportService,
};