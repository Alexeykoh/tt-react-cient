import { ProjectRole } from "../enums/project-role.enum";

export interface ProjectShared {
  member_id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  approve: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectSharedCreateDTO {
  project_id: string;
  user_id: string;
  role: ProjectRole;
}
