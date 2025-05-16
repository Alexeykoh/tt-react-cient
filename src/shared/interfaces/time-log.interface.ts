import { z } from "zod";
import { CurrencySchema } from "./currency.interface";
import { PAYMENT } from "./task.interface";
import { TIMELOGSTATUS } from "../enums/time-logs.enum";

const TIMELOGSTATUSSchema = z.nativeEnum(TIMELOGSTATUS);

// TimeLogSchema
export const TimeLogSchema = z.union([
  z.object({
    log_id: z.string(),
    task_id: z.string(),
    user_id: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    status: TIMELOGSTATUSSchema,
    duration: z.union([z.number(), z.string()]),
    common_duration: z.union([z.number(), z.string()]).optional().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
  z.null(),
]);

// Вложенные схемы для LatestLog

const LatestLogProjectMemberSchema = z.object({
  member_id: z.string(),
  role: z.string(),
});

const LatestLogProjectSchema = z.object({
  project_id: z.string(),
  name: z.string(),
  members: z.array(LatestLogProjectMemberSchema),
});

const LatestLogTaskSchema = z.object({
  task_id: z.string(),
  name: z.string(),
  is_paid: z.boolean(),
  rate: z.string(),
  payment_type: z.nativeEnum(PAYMENT),
  project: LatestLogProjectSchema,
  currency: CurrencySchema,
});

// LatestLogSchema
export const LatestLogSchema = z.object({
  log_id: z.string(),
  created_at: z.string(),
  status: TIMELOGSTATUSSchema,
  task: LatestLogTaskSchema,
});

// Типы (интерфейсы) внизу

export type TimeLog = z.infer<typeof TimeLogSchema>;
export type LatestLog = z.infer<typeof LatestLogSchema>;
