// User Types
export interface Member {
  id: number;
  supervisor_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  groups?: Group[];
  supervisor?: Member | null;
}

export interface User extends Member {
  is_admin: boolean;
  is_training_manager: boolean;

  // Flask UserMixin properties
  is_authenticated?: boolean;
  is_anonymous?: boolean;
}

export interface Group {
  id: number | null;
  name: string;
  is_admin: boolean;
  is_training_manager: boolean;
  current_user_is_member?: boolean | null;
}
