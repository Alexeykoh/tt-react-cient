import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import { useGetUserByIdQuery } from "@/shared/api/user.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useParams } from "react-router-dom";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userData } = useGetUserByIdQuery(id || "", { skip: !id });

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex gap-2 items-center pb-4">
        <UserAvatar
          size="large"
          name={userData?.name || ""}
          planId={SUBSCRIPTION.FREE}
        />
        <h1 className="text-2xl font-bold">{userData?.name}</h1>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex p-4"></CardContent>
      </Card>
    </div>
  );
}
