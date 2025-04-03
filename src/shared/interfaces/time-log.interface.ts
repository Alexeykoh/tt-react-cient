import { Currency } from "./currency.interface";
import { PAYMENT } from "./task.interface";

export interface TimeLog {
  log_id: string;
  task_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: TIMELOGSTATUS;
  duration: number | string;
  common_duration: string;
  created_at: string;
  updated_at: string;
}

export interface LatestLog {
  log_id: string;
  created_at: string;
  status: TIMELOGSTATUS;
  task: {
    task_id: string;
    name: string;
    is_paid: boolean;
    rate: string;
    payment_type: PAYMENT;
    project: {
      project_id: string;
      name: string;
      members: Array<{
        member_id: string;
        role: string;
      }>;
    };
    currency: Currency;
  };
}

export enum TIMELOGSTATUS {
  PROGRESS = "in-progress",
  COMPLETED = "completed",
}
