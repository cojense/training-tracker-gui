import { User } from '~/types/user';

export type StorageKey = string;

export interface CertificateInfo {
  storage_key: StorageKey;
  filename: string;
}

export interface Training {
  id: number;
  date: string | null;
  title: string | null;
  description?: string;
  url: string | null;
}

export interface TrainingCertificate {
  id: number | null;
  event_id: number | null;
  original_filename: string;
  upload_date: string;
  storage_key: StorageKey;
  comment: string;
  event?: TrainingEvent | null;
}

export interface TrainingEvent {
  id: number | null;
  user_id: number;
  completion_date: string;
  approved_by: number | null;
  approved_date: string | null;
  comment: string | null;
  certificate_unavailable: boolean | null;

  // Relationships
  training_certificates: TrainingCertificate[];
  training: Training;
  user?: User | null;
}
