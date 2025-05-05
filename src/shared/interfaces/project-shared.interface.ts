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

export interface ProjectSharedDeleteDTO {
  project_id: string;
  user_id: string;
}

export interface FriendsOnProject {
  user_id: string;
  name: string;
  email: string;
  in_project: {
    member_id: string;
    project_id: string;
    user_id: string;
    role: ProjectRole;
    approve: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ProjectInvitations {
  member_id: string;
  project_id: string;
  role: ProjectRole;
  project: {
    name: string;
    user: {
      name: string;
      email: string;
    };
  };
}
