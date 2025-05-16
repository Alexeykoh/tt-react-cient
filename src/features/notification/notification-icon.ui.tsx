import React from "react";
import {
  UserPlus,
  UserCheck,
  UserX,
  LogOut,
  LogIn,
  Mail,
  Trash2,
  MessageCircle,
  CheckCircle,
  XCircle,
  Bell,
  Clock,
} from "lucide-react";
import { NOTIFICATION_TYPE } from "@/shared/enums/notification-type.enum";

interface NotificationIconProps {
  type: NOTIFICATION_TYPE;
  size?: number;
  color?: string;
}

const iconsMap: Record<
  NOTIFICATION_TYPE,
  React.FC<{ size?: number; color?: string }>
> = {
  [NOTIFICATION_TYPE.FRIENDSHIP_INVITATION]: UserPlus,
  [NOTIFICATION_TYPE.FRIENDSHIP_INVITATION_ACCEPTED]: UserCheck,
  [NOTIFICATION_TYPE.FRIENDSHIP_INVITATION_DECLINED]: UserX,
  [NOTIFICATION_TYPE.PROJECT_LEAVE_FOR_USER]: LogOut,
  [NOTIFICATION_TYPE.PROJECT_LEAVE_FOR_OWNER]: LogIn,
  [NOTIFICATION_TYPE.PROJECT_INVITATION_ACCEPTED]: CheckCircle,
  [NOTIFICATION_TYPE.PROJECT_INVITATION_DECLINED]: XCircle,
  [NOTIFICATION_TYPE.PROJECT_INVITATION]: Mail,
  [NOTIFICATION_TYPE.PROJECT_DELETE]: Trash2,
  [NOTIFICATION_TYPE.PROJECT_COMMENT]: MessageCircle,
  [NOTIFICATION_TYPE.TASK_INVITATION_ACCEPTED]: CheckCircle,
  [NOTIFICATION_TYPE.TASK_INVITATION_DECLINED]: XCircle,
  [NOTIFICATION_TYPE.TASK_INVITATION]: Mail,
  [NOTIFICATION_TYPE.TASK_COMMENT]: MessageCircle,
  [NOTIFICATION_TYPE.TIME_LOG_START]: Clock,
  [NOTIFICATION_TYPE.TIME_LOG_STOP]: Clock,
};

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  type,
  size = 24,
  color = "currentColor",
}) => {
  const IconComponent = iconsMap[type] || Bell; // Bell - иконка по умолчанию
  return <IconComponent size={size} color={color} />;
};
