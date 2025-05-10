import { z } from "zod";
import { NOTIFICATION_TYPE } from "../enums/notification-type.enum";

export const notificationsSchema = z.object({
  id: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  type: z.nativeEnum(NOTIFICATION_TYPE).optional(),
  data: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const notificationsSchemaResponse = z.object({
  data: z.array(notificationsSchema),
});

export type INotification = z.infer<typeof notificationsSchema>;
export type INotificationResponse = z.infer<typeof notificationsSchemaResponse>;