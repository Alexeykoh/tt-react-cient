import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarUrl } from "@/lib/get-avatar-url";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";

interface Props {
  name: string;
  planId: SUBSCRIPTION;
}

export default function UserAvatar({ name, planId }: Props) {
  return (
    <Avatar
      className={`h-8 w-8 rounded-lg ${planId === SUBSCRIPTION.BASIC && "ring-2 ring-emerald-600"} ${planId === SUBSCRIPTION.PREMIUM && "ring-2 ring-purple-600"}`}
    >
      <AvatarImage src={getAvatarUrl(name)} alt={name} />
      <AvatarFallback className="rounded-lg">
        <Loader className="animate-spin" />
      </AvatarFallback>
    </Avatar>
  );
}
