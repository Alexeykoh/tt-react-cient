export interface TimeLog {
  log_id: string;
  task_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: TIMELOGSTATUS;
  duration: number | string;
  created_at: string;
  updated_at: string;
}

export enum TIMELOGSTATUS {
  PROGRESS = "in-progress",
  COMPLETED = "completed",
}
