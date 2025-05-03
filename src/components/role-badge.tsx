import { ProjectRole } from "@/shared/enums/project-role.enum";
import { Badge } from "./ui/badge";
import { BriefcaseBusiness, CircleCheck, Crown, User } from "lucide-react";

interface props {
  role: ProjectRole | undefined;
  showIcon?: boolean;
  showText?: boolean;
}
export default function RoleBadge({
  role,
  showIcon = true,
  showText = true,
}: props) {
  switch (role) {
    case ProjectRole.OWNER:
      return (
        <Badge variant={"outline"} className="border-primary/60">
          {showIcon && <Crown className="size-3.5" />}
          {showText && "Владелец"}
        </Badge>
      );
    case ProjectRole.EXECUTOR:
      return (
        <Badge variant={"outline"} className="border-orange-400/40">
          {showIcon && <CircleCheck className="size-3.5" />}
          {showText && "Исполнитель"}
        </Badge>
      );
    case ProjectRole.MANAGER:
      return (
        <Badge variant={"outline"} className="border-sky-400/40">
          {showIcon && <BriefcaseBusiness className="size-3.5" />}
          {showText && "Менеджер"}
        </Badge>
      );
    case ProjectRole.GUEST:
      return (
        <Badge variant={"outline"} className="border-gray-400/40">
          {showIcon && <User className="size-3.5" />}
          {showText && "Гость"}
        </Badge>
      );
    default:
      return (
        <Badge variant={"outline"} className="border-gray-400/40">
          {showIcon && <User className="size-3.5" />}
          {showText && "Гость"}
        </Badge>
      );
  }
}
