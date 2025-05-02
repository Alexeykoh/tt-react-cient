import { ProjectRole } from "../enums/project-role.enum";
import { SUBSCRIPTION, SUBSCRIPTION_STATUS } from "../enums/sunscriptions.enum";
import { Client } from "./client.interface";
import { Currency } from "./currency.interface";

export interface Project {
  project_id: string;
  name: string;
  created_at: string;
  rate: string;
  currency: Currency;
  client: Client | null;
  members: {
    role: ProjectRole;
    approve: boolean;
    user: {
      user_id: string;
      name: string;
      email: string;
      subscriptions: {
        planId: SUBSCRIPTION;
        status: SUBSCRIPTION_STATUS;
      }[];
    };
  }[];
}
