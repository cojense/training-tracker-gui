export type TrainingRecord = {
  id: number;
  training_name: string;
  completion_date?: string;
  approval_date?: string;
  certificates?: string | unknown;
};

export type GroupMembership = {
  id: number;
  group_name: string;
  is_admin: boolean;
  is_training_manager: boolean;
};

export type UserDetail = {
  id: number;
  user_name: string;
  email: string;
  is_admin: boolean;
  is_training_engineer: boolean;
  supervisor_name: string;
};

export type TrainingCourse = {
  id: number;
  date: string;
  training_name: string;
  training_link?: string;
  external_url?: string;
};
