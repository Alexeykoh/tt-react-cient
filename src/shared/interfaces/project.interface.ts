import { z } from "zod";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import { PROJECT_ROLE } from "../enums/project-role.enum";
import { SUBSCRIPTION, SUBSCRIPTION_STATUS } from "../enums/sunscriptions.enum";
import { ClientSchema } from "./client.interface";
import { CurrencySchema } from "./currency.interface";

// ENUM схемы
const PROJECT_ROLESchema = z.nativeEnum(PROJECT_ROLE);
const PAYMENTSchema = z.nativeEnum(PAYMENT);
const SUBSCRIPTIONSchema = z.nativeEnum(SUBSCRIPTION);
const SUBSCRIPTION_STATUSSchema = z.nativeEnum(SUBSCRIPTION_STATUS);

// ProjectMembersUserSubscriptionsSchema
const ProjectMembersUserSubscriptionSchema = z.object({
  planId: SUBSCRIPTIONSchema,
  status: SUBSCRIPTION_STATUSSchema,
});

// ProjectMembersUserSchema
export const ProjectMembersUserSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  subscriptions: z.array(ProjectMembersUserSubscriptionSchema),
});

// ProjectMembersSchema
export const ProjectMembersSchema = z.object({
  member_id: z.string(),
  role: PROJECT_ROLESchema,
  approve: z.boolean(),
  rate: z.string(),
  currency: CurrencySchema,
  payment_type: PAYMENTSchema,
  user: ProjectMembersUserSchema,
});

// ProjectSchema
export const ProjectSchema = z.object({
  project_id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  client: ClientSchema.nullable(),
  members: z.array(ProjectMembersSchema),
});

// CreateProjectDTOSchema
export const CreateProjectDTOSchema = z.object({
  name: z.string(),
  currency_id: z.string(),
  rate: z.number(),
  tag_ids: z.array(z.string()),
  client_id: z.string().nullable(),
});

// UpdateProjectDTOSchema
export const UpdateProjectDTOSchema = z.object({
  name: z.string().optional(),
  currency_id: z.string().optional(),
  rate: z.number().optional(),
});

// GetPeojectMeDTOSchema
export const GetPeojectMeDTOSchema = z.object({
  page: z.number(),
  limit: z.number().optional(),
  client_id: z.string().optional(),
  role: PROJECT_ROLESchema.optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
  sortBy: z.enum(["name", "created_at"]).optional(),
});

export const ProjectByIdSchema = z.object({
  project: ProjectSchema,
  info: z.object({
    owner: ProjectMembersSchema,
    isUserOwner: z.boolean(),
    invitedUsers: z.array(ProjectMembersSchema),
    myRate: z.union([z.number(), z.string()]),
    myRole: PROJECT_ROLESchema,
    myPaymentType: PAYMENTSchema,
    myCurrency: CurrencySchema,
    client: ClientSchema.nullable(),
    projectDuration: z.number(),
  }),
});

export type ProjectMembersUser = z.infer<typeof ProjectMembersUserSchema>;
export type ProjectMembers = z.infer<typeof ProjectMembersSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectDTO = z.infer<typeof CreateProjectDTOSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectDTOSchema>;
export type GetPeojectMeDTO = z.infer<typeof GetPeojectMeDTOSchema>;
export type ProjectById = z.infer<typeof ProjectByIdSchema>;
