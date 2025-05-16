import { z } from "zod";
import { SUBSCRIPTION } from "../enums/sunscriptions.enum";
import { CurrencySchema } from "./currency.interface";

// Схема для features внутри Plans
const PlansFeaturesSchema = z.object({
  maxProjects: z.union([z.number(), z.string()]),
  storageGB: z.union([z.number(), z.string()]),
  prioritySupport: z.boolean(),
});

// Схема PlansSchema
export const PlansSchema = z.object({
  id: z.union([z.number(), z.string()]),
  code: z.nativeEnum(SUBSCRIPTION),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  billingPeriod: z.string(),
  isActive: z.boolean(),
  features: PlansFeaturesSchema,
  trialDays: z.union([z.string(), z.number(), z.null()]),
  currency: CurrencySchema,
});

export type Plans = z.infer<typeof PlansSchema>;
