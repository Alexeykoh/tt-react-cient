import { Badge } from "@/components/ui/badge";

interface iOwnerUi {
  isOwner: boolean;
}

export default function OwnerUi({ isOwner }: iOwnerUi) {
  if (isOwner) {
    return <Badge>Вы</Badge>;
  }

  return null;
}
