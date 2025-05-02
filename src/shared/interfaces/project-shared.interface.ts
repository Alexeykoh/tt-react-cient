import { ProjectRole } from "../enums/project-role.enum";

export interface ProjectShared {
  member_id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  approve: boolean;
  created_at: string;
  updated_at: string;
  user: {
    user_id: string;
    name: string;
    email: string;
    // subscriptions: {
    //   planId: string;
    //   status: string;
    // }[];
  };
}

export interface ProjectSharedCreateDTO {
  project_id: string;
  user_id: string;
  role: ProjectRole;
}
