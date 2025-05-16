import { z } from "zod";
import { CurrencySchema } from "./currency.interface";

// PAYMENT enum и схема
export enum PAYMENT {
  FIXED = "fixed",
  HOURLY = "hourly",
}
const PAYMENTSchema = z.nativeEnum(PAYMENT);

// TaskStatus enum и схема
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

// TaskMemberUserSchema
const TaskMemberUserSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
});

// TaskMemberSchema
export const TaskMemberSchema = z.object({
  member_id: z.string(),
  user: TaskMemberUserSchema,
});

// TaskStatusColumnSchema
export const TaskStatusColumnSchema = z.object({
  id: z.string(),
  order: z.number(),
  color: z.string().nullable(),
  name: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// TaskStatusSchema (вложенный объект taskStatus)
const TaskStatusNestedSchema = z.object({
  id: z.string(),
  taskStatusColumn: TaskStatusColumnSchema,
});

// Project вложенный объект в Task
const TaskProjectSchema = z.object({
  project_id: z.string(),
  name: z.string(),
});

// TaskSchema
export const TaskSchema = z.object({
  task_id: z.string(),
  name: z.string(),
  description: z.string(),
  is_paid: z.boolean(),
  order: z.number(),
  payment_type: PAYMENTSchema,
  project_id: z.string().optional(), // TODO: устарело!
  rate: z.union([z.number(), z.string()]),
  created_at: z.string(),
  updated_at: z.string().optional(),
  currency: CurrencySchema,
  project: TaskProjectSchema,
  taskStatus: TaskStatusNestedSchema,
  taskMembers: z.array(TaskMemberSchema),
});

// AssignUserDtoSchema
export const AssignUserDtoSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
});

// CreateTaskDtoSchema
export const CreateTaskDtoSchema = z.object({
  name: z.string(),
  project_id: z.string(),
  description: z.string(),
  is_paid: z.boolean(),
  order: z.number(),
  tag_ids: z.array(z.string()),
});

// UpdateTaskDtoSchema
export const UpdateTaskDtoSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  is_paid: z.boolean().optional(),
  payment_type: PAYMENTSchema.optional(),
  order: z.number().optional(),
  rate: z.string().optional(),
  created_at: z.string().optional(),
  currency_id: z.string().optional(),
});

// UpdateTaskStatusDtoSchema
export const UpdateTaskStatusDtoSchema = z.object({
  task_id: z.string(),
  task_status_column_id: z.string(),
});

// UpdateTasksOrderDTO Schema
export const UpdateTasksOrderDTOSchema = z.object({
  project_id: z.string(),
  column_id: z.string(),
  task_orders: z.array(
    z.object({
      task_id: z.string(),
      order: z.number(),
    })
  ),
});

// Типы (интерфейсы) внизу

export type TaskMember = z.infer<typeof TaskMemberSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type AssignUserDto = z.infer<typeof AssignUserDtoSchema>;
export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;
export type TaskStatusColumn = z.infer<typeof TaskStatusColumnSchema>;
export type UpdateTaskStatusDto = z.infer<typeof UpdateTaskStatusDtoSchema>;
export type UpdateTasksOrderDTO = z.infer<typeof UpdateTasksOrderDTOSchema>;
