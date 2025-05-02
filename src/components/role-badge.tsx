import { ProjectRole } from "@/shared/enums/project-role.enum";
import { Badge } from "./ui/badge";

interface props {
  role: ProjectRole | undefined;
}
export default function RoleBadge({ role }: props) {
  switch (role) {
    case ProjectRole.OWNER:
      return (
        <Badge variant={"outline"} className="border-primary/60">
          {"Владелец"}
        </Badge>
      );
    case ProjectRole.EXECUTOR:
      return (
        <Badge variant={"outline"} className="border-orange-400/40">
          {"Исполнитель"}
        </Badge>
      );
    case ProjectRole.MANAGER:
      return (
        <Badge variant={"outline"} className="border-sky-400/40">
          {"Менеджер"}
        </Badge>
      );
    case ProjectRole.GUEST:
      return (
        <Badge variant={"outline"} className="border-gray-400/40">
          {"Гость"}
        </Badge>
      );
    default:
      return (
        <Badge variant={"outline"} className="border-gray-400/40">
          {"Гость"}
        </Badge>
      );
  }
}
