import { z } from "zod";
import { NotificationType } from "../enums/notification-type.enum";

export const notificationsSchema = z.object({
  id: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  type: z.nativeEnum(NotificationType).optional(),
  data: z.unknown().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const notificationsSchemaResponse = z.object({
  data: z.array(notificationsSchema),
});

export type INotification = z.infer<typeof notificationsSchema>;
export type INotificationResponse = z.infer<typeof notificationsSchemaResponse>;