import { Currency } from "./currency.interface";

export interface TaskMember {
  member_id: string;
  user: {
    user_id: string;
    name: string;
    email: string;
  };
}

export interface Task {
  task_id: string;
  name: string;
  description: string;
  is_paid: boolean;
  payment_type: PAYMENT;
  project_id: string;
  rate: number | string;
  created_at: string;
  currency: Currency;
  order: number;
  project: {
    project_id: string;
    name: string;
  };
  taskStatus: {
    id: string;
    taskStatusColumn: {
      id: string;
      name: string;
      color: string;
    };
  };
  taskMembers: Array<TaskMember>;
}

export interface AssignUserDto {
  taskId: string;
  userId: string;
}

export enum PAYMENT {
  FIXED = "fixed",
  HOURLY = "hourly",
}
export interface CreateTaskDto {
  name: string;
  project_id: string;
  description: string;
  is_paid: boolean;
  order: number;
  tag_ids: Array<string>;
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  is_paid?: boolean;
  payment_type?: PAYMENT;
  order?: number;
  rate?: string;
  created_at?: string;
  currency_id?: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface TaskStatusColumn {
  id: string;
  order: number;
  color: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateTaskStatusDto {
  task_id: string;
  task_status_column_id: string;
}
