import { useGetProjectsSharedFilterQuery } from "@/shared/api/projects-shared.service";
import { useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";

export default function ProjectMembersPage() {
  const { id } = useParams<{ id: string }>();
  const { data: members } = useGetProjectsSharedFilterQuery(
    { role: "all", project_id: id || "" },
    { skip: !id }
  );

  return (
    <div className="flex p-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        {members?.map((el) => (
          <Card className="p-1 w-full">
            <CardContent className="p-1">
              <div className="flex items-center gap-2">
                <UserAvatar
                  size="xs"
                  name={el.user.name}
                  planId={SUBSCRIPTION.FREE}
                />
                <p>{el.user.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
