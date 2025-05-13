import { z } from "zod";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import { PROJECT_ROLE } from "../enums/project-role.enum";
import { CurrencySchema } from "./currency.interface";

// ENUM схемы
const PROJECT_ROLESchema = z.nativeEnum(PROJECT_ROLE);
const PAYMENTSchema = z.nativeEnum(PAYMENT);

// Схемы вложенных объектов
const ProjectSharedUserSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
});

const FriendsOnProjectInProjectSchema = z.object({
  member_id: z.string(),
  project_id: z.string(),
  user_id: z.string(),
  role: PROJECT_ROLESchema,
  rate: z.union([z.string(), z.number()]),
  payment_type: PAYMENTSchema,
  currency: CurrencySchema,
  approve: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const ProjectInvitationsProjectUserSchema = z.object({
  name: z.string(),
  email: z.string(),
});

const ProjectInvitationsProjectSchema = z.object({
  name: z.string(),
  user: ProjectInvitationsProjectUserSchema,
});

// Основные схемы
export const ProjectSharedSchema = z.object({
  member_id: z.string(),
  project_id: z.string(),
  user_id: z.string(),
  role: PROJECT_ROLESchema,
  approve: z.boolean(),
  payment_type: PAYMENTSchema,
  rate: z.union([z.string(), z.number()]),
  created_at: z.string(),
  updated_at: z.string(),
  user: ProjectSharedUserSchema,
  currency: CurrencySchema,
});

export const GetProjectSharedMembersDTOSchema = z.object({
  role: z.enum(["all", "owner", "shared"]),
  project_id: z.string(),
});

export const ProjectSharedCreateDTOSchema = z.object({
  project_id: z.string(),
  user_id: z.string(),
  role: PROJECT_ROLESchema,
  rate: z.union([z.number(), z.string()]),
  currency_id: z.string(),
});

export const ProjectSharedPatchDTOSchema = z.object({
  role: PROJECT_ROLESchema,
  rate: z.union([z.number(), z.string()]),
  currency_id: z.string(),
  payment_type: PAYMENTSchema,
});

export const ProjectSharedDeleteDTOSchema = z.object({
  project_id: z.string(),
  user_id: z.string(),
});

export const FriendsOnProjectSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  in_project: z.union([FriendsOnProjectInProjectSchema, z.null()]),
});

export const ProjectInvitationsSchema = z.object({
  member_id: z.string(),
  project_id: z.string(),
  role: PROJECT_ROLESchema,
  rate: z.string(),
  payment_type: PAYMENTSchema,
  project: z.union([ProjectInvitationsProjectSchema, z.null()]),
  currency: CurrencySchema,
});

// Типы (интерфейсы) внизу

export type ProjectShared = z.infer<typeof ProjectSharedSchema>;
export type GetProjectSharedMembersDTO = z.infer<
  typeof GetProjectSharedMembersDTOSchema
>;
export type ProjectSharedCreateDTO = z.infer<
  typeof ProjectSharedCreateDTOSchema
>;
export type ProjectSharedPatchDTO = z.infer<typeof ProjectSharedPatchDTOSchema>;
export type ProjectSharedDeleteDTO = z.infer<
  typeof ProjectSharedDeleteDTOSchema
>;
export type FriendsOnProject = z.infer<typeof FriendsOnProjectSchema>;
export type ProjectInvitations = z.infer<typeof ProjectInvitationsSchema>;
