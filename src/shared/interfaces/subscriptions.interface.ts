import { z } from "zod";
import { SUBSCRIPTION, SUBSCRIPTION_STATUS } from "../enums/sunscriptions.enum";

const SUBSCRIPTIONSchema = z.nativeEnum(SUBSCRIPTION);
const SUBSCRIPTION_STATUSSchema = z.nativeEnum(SUBSCRIPTION_STATUS);

export const SubscriptionsSchema = z.object({
  id: z.union([z.number(), z.string()]),
  planId: SUBSCRIPTIONSchema,
  status: SUBSCRIPTION_STATUSSchema,
  startDate: z.string(),
  endDate: z.string(),
});

export type Subscriptions = z.infer<typeof SubscriptionsSchema>;
