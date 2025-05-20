import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import { Badge } from "./ui/badge";
import { BriefcaseBusiness, CircleCheck, Star, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface props {
  role: PROJECT_ROLE | undefined;
  showIcon?: boolean;
  showText?: boolean;
}

const roleMap: Record<
  PROJECT_ROLE,
  {
    icon: React.ReactNode;
    text: string;
    border: string;
  }
> = {
  [PROJECT_ROLE.OWNER]: {
    icon: <Star className="size-7" />,
    text: "Владелец",
    border: "bg-primary/20",
  },
  [PROJECT_ROLE.EXECUTOR]: {
    icon: <CircleCheck className="size-7" />,
    text: "Исполнитель",
    border: "bg-orange-400/20",
  },
  [PROJECT_ROLE.MANAGER]: {
    icon: <BriefcaseBusiness className="size-7" />,
    text: "Менеджер",
    border: "bg-sky-400/20",
  },
  [PROJECT_ROLE.GUEST]: {
    icon: <User className="size-7" />,
    text: "Гость",
    border: "bg-gray-400/20",
  },
};

export default function RoleBadge({
  role,
  showIcon = true,
  showText = true,
}: props) {
  if (showText && role) {
    return (
      <Badge variant={"default"} className={roleMap[role].border}>
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
              <Badge variant={"default"} className={roleMap[role].border}>
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
