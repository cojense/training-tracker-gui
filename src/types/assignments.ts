import { Member } from '~/types/user';
import { Training } from '~/types/training';
import { Project } from '~/types/projects';

export interface Assignment {
  group_id: number;
  training: Training;
  project: Project;
  start_date: string;
  end_date: string | null;
  suspense_date: string;
  cadence: string;
  no_nag: boolean;
}

export interface AssignedTraining {
  member: Member;
  assignment: Assignment;
  projects: Project[];
  completion_date: string | null;
  approved_date: string | null;
  due_date: string | null;
}
