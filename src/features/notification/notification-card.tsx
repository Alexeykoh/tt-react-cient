import { cn } from "@/lib/utils";
import { useReadNotificationsMutation } from "@/shared/api/notification.service";
import { INotification } from "@/shared/interfaces/notifications.interface";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { NOTIFICATION_TYPE } from "@/shared/enums/notification-type.enum";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import parseAndHighlight from "@/lib/parse-notification-message";
import NotificationsDialog from "./notifications.dialog";
import { NotificationIcon } from "./notification-icon.ui";

interface NotificationCardProps {
  notification: INotification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const [expand, setExpand] = useState<boolean>(false);
  const [readNotifications] = useReadNotificationsMutation();

  function readNotificationHandler(notificationId: string) {
    if (notification.isRead) return;
    readNotifications(notificationId);
  }

  // Обработка случая, если notification.type отсутствует
  if (!notification.type) {
    return null;
  }

  return (
    <NotificationsDialog
      notificationType={
        notification.type || NOTIFICATION_TYPE.FRIENDSHIP_INVITATION
      }
      metaDataProp={notification?.data || null}
    >
      <div
        onClick={() => {
          setExpand(!expand);
          readNotificationHandler(notification.id);
        }}
        key={notification.id}
        className={cn(
          "flex items-start space-x-4 p-3 rounded-lg transition-colors cursor-pointer",
          !notification.isRead ? "bg-muted/50" : ""
        )}
      >
        <div className="mt-1 flex flex-col items-center">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1 space-y-1 items-start">
          <div className="flex items-start justify-between">
            <div className="flex-1 items-start">
              <p
                className={cn(
                  "text-sm text-start max-h-32 overflow-y-auto ",
                  !notification.isRead && "font-medium"
                )}
              >
                {parseAndHighlight(notification.message)}
              </p>
            </div>
            {/* {notificationVariant.actionButton && (
            <div className="mt-1">{notificationVariant.actionButton}</div>
          )} */}
            {!notification.isRead && (
              <Badge variant="default" className="ml-2 shrink-0 ">
                Новое
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
          </div>
        </div>
      </div>
    </NotificationsDialog>
  );
}
