import { PAYMENT } from "@/shared/interfaces/task.interface";
import { PROJECT_ROLE } from "../enums/project-role.enum";
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

export interface CreateProjectDTO {
  name: string;
  currency_id: string;
  rate: number;
  tag_ids: string[];
  client_id: string | null;
}

export interface UpdateProjectDTO {
  name?: string;
  currency_id?: string;
  rate?: number;
}

export interface ProjectMembers {
  member_id: string;
  role: PROJECT_ROLE;
  approve: boolean;
  rate: string;
  currency: Currency;
  payment_type: PAYMENT;
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
