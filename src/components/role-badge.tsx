import { ProjectRole } from "@/shared/enums/project-role.enum";
import { Badge } from "./ui/badge";
import { BriefcaseBusiness, CircleCheck, Crown, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface props {
  role: ProjectRole | undefined;
  showIcon?: boolean;
  showText?: boolean;
}

const roleMap: Record<
  ProjectRole,
  {
    icon: React.ReactNode;
    text: string;
    border: string;
  }
> = {
  [ProjectRole.OWNER]: {
    icon: <Crown className="size-5" />,
    text: "Владелец",
    border: "border-primary/60",
  },
  [ProjectRole.EXECUTOR]: {
    icon: <CircleCheck className="size-5" />,
    text: "Исполнитель",
    border: "border-orange-400/40",
  },
  [ProjectRole.MANAGER]: {
    icon: <BriefcaseBusiness className="size-5" />,
    text: "Менеджер",
    border: "border-sky-400/40",
  },
  [ProjectRole.GUEST]: {
    icon: <User className="size-5" />,
    text: "Гость",
    border: "border-gray-400/40",
  },
};

export default function RoleBadge({
  role,
  showIcon = true,
  showText = true,
}: props) {
  if (showText && role) {
    return (
      <Badge variant={"outline"} className={roleMap[role].border}>
        {showIcon && roleMap[role].icon}
        {showText && roleMap[role].text}
      </Badge>
    );
  }

  if (!showText && role) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {role && (
              <Badge variant={"outline"} className={roleMap[role].border}>
                {showIcon && roleMap[role].icon}
                {showText && roleMap[role].text}
              </Badge>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{role && roleMap[role].text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}
