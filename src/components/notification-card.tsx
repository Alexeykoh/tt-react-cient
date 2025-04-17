import { cn } from "@/lib/utils";
import { useReadNotificationsMutation } from "@/shared/api/notification.service";
import { INotification } from "@/shared/interfaces/notifications.interface";
import { formatDistanceToNow } from "date-fns";
import { Bell, LucideProps } from "lucide-react";
import { Badge } from "./ui/badge";
import { NotificationType } from "@/shared/enums/notification-type.enum";
import { JSX, useState } from "react";
import { Button } from "./ui/button";

interface NotificationCardProps {
  notification: INotification;
}

interface NotificationCardActionsProps {
  type: NotificationType;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const [expand, setExpand] = useState<boolean>(false);
  const [readNotifications] = useReadNotificationsMutation();
  function readNotificationHandler(notificationId: string) {
    if (notification.isRead) return;
    readNotifications(notificationId);
  }

  function getNotificationVariant({ type }: NotificationCardActionsProps): {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    label: string;
    actionButton: JSX.Element | null;
  } {
    switch (type) {
      case NotificationType.FRIENDSHIP_INVITATION:
        return {
          icon: Bell,
          label: "Приглашение в друзья",
          actionButton: <Button>Принять</Button>,
        };

      default:
        return {
          icon: Bell,
          label: "Уведомление",
          actionButton: null,
        };
    }
  }

  // Обработка случая, если notification.type отсутствует
  if (!notification.type) {
    return null;
  }

  const notificationVariant = getNotificationVariant({
    type: notification.type,
  });

  const Icon = notificationVariant.icon;

  return (
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
        <Icon size={20} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn("text-sm", !notification.isRead && "font-medium")}>
              {notification.message}
            </p>
          </div>
          {notificationVariant.actionButton && (
            <div className="mt-1">{notificationVariant.actionButton}</div>
          )}
          {!notification.isRead && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              Новое
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
