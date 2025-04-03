import { Currency } from "./currency.interface";

export interface Task {
  task_id: string;
  name: string;
  description: string;
  is_paid: boolean;
  payment_type: PAYMENT;
  rate: number | string;
  created_at: string;
  currency: Currency;
  project: {
    project_id: string;
    name: string;
  };
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
  payment_type: PAYMENT;
  rate: number | string;
  currency_id: string;
  tag_ids: Array<string>;
}

export interface UpdateTaskDto {
  task_id: string;
  name?: string;
  description?: string;
  is_paid?: boolean;
  payment_type?: PAYMENT;
  rate?: string;
  created_at?: string;
  currency_id?: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
