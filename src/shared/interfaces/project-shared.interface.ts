import { PAYMENT } from "@/shared/interfaces/task.interface";
import { PROJECT_ROLE } from "../enums/project-role.enum";
import { Currency } from "./currency.interface";

export interface ProjectShared {
  member_id: string;
  project_id: string;
  user_id: string;
  role: PROJECT_ROLE;
  approve: boolean;
  payment_type: PAYMENT;
  rate: string | number;
  created_at: string;
  updated_at: string;
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  currency: Currency;
}

export interface GetProjectSharedMembersDTO {
  role: "all" | "owner" | "shared";
  project_id: string;
}

export interface ProjectSharedCreateDTO {
  project_id: string;
  user_id: string;
  role: PROJECT_ROLE;
  rate: number | string;
  currency_id: string;
}

export interface ProjectSharedPatchDTO {
  role: PROJECT_ROLE;
  rate: number | string;
  currency_id: string;
  payment_type: PAYMENT;
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
    role: PROJECT_ROLE;
    rate: string | number;
    payment_type: PAYMENT;
    currency: Currency;
    approve: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ProjectInvitations {
  member_id: string;
  project_id: string;
  role: PROJECT_ROLE;
  currency: Currency;
  rate: string;
  payment_type: PAYMENT;
  project: {
    name: string;
    user: {
      name: string;
      email: string;
    };
  };
}
