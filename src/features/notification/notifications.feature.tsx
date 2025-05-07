import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
} from "@/shared/api/notification.service";
import { Bell, CheckCheck } from "lucide-react";
import { INotification } from "@/shared/interfaces/notifications.interface";
import { NotificationCard } from "@/features/notification/notification-card";

export default function NotificationsFeature() {
  const { data: rawNotifications, isLoading } = useGetNotificationsQuery();
  const notifications: INotification[] = rawNotifications?.data ?? [];
  const unreadCount = notifications.filter(
    (notification: INotification) => !notification.isRead
  ).length;
  const [readAllNotifications] = useReadAllNotificationsMutation();

  function markAllAsReadHendlre() {
    readAllNotifications();
  }

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="flex-1 flex flex-col h-full overflow-scroll">
        <div className={cn("w-full")}>
          <div className="flex flex-col items-center justify-between space-y-0 py-4">
            <div>
              {unreadCount > 0
                ? `У вас ${unreadCount} непрочитанных уведомлений`
                : ""}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsReadHendlre}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Отметить все как прочитанные
              </Button>
            )}
          </div>
          <div className="pb-2">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p>У вас пока нет уведомлений</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {notifications.map((notification: INotification) => (
                  <NotificationCard
                    notification={notification}
                    key={notification.id}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button variant="outline" className="w-full" size="sm">
              Показать все уведомления
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
