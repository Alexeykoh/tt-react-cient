import { ProjectRole } from "../enums/project-role.enum";
import { SUBSCRIPTION, SUBSCRIPTION_STATUS } from "../enums/sunscriptions.enum";
import { Client } from "./client.interface";
import { Currency } from "./currency.interface";

export interface Project {
  project_id: string;
  name: string;
  created_at: string;
  client: Client | null;
  members: Array<ProjectMembers>;
}

export interface ProjectMembers {
  role: ProjectRole;
  approve: boolean;
  rate: string;
  currency: Currency;
  user: ProjectMembersUser;
}

export interface ProjectMembersUser {
  user_id: string;
  name: string;
  email: string;
  subscriptions: {
    planId: SUBSCRIPTION;
    status: SUBSCRIPTION_STATUS;
  }[];
}
