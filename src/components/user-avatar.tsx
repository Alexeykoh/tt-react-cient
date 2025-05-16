import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/get-avatar-url";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  name: string;
  planId: SUBSCRIPTION;
  size?: "xs" | "small" | "large";
  metaText?: string;
}

export default function UserAvatar({
  name,
  planId,
  size = "small",
  metaText = "",
}: Props) {
  function setSize(size: "xs" | "small" | "large") {
    switch (size) {
      case "xs":
        return "size-6";
      case "small":
        return "size-8";
      case "large":
        return "size-16";
      default:
        return "size-8";
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar
              className={`${setSize(size)} rounded-full ${planId === SUBSCRIPTION.BASIC && "ring-2 ring-emerald-600"} ${planId === SUBSCRIPTION.PREMIUM && "ring-2 ring-purple-600"}`}
            >
              <AvatarImage src={getAvatarUrl(name, planId)} alt={name} />
              <AvatarFallback className="rounded-full">
                <Loader className="animate-spin" />
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
            {metaText && <p>{metaText}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
