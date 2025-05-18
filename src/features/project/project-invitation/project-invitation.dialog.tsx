import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RoleBadge from "@/components/role-badge";
import UserAvatar from "@/components/user-avatar";
import {
  useGetProjectsSharedInvationsQuery,
  useApproveProjectSharedInvationMutation,
  useDeleteRoleProjectSharedMutation,
} from "@/shared/api/projects-shared.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetUserQuery } from "@/shared/api/user.service";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface props {
  dialogIsOpen: boolean;
  setDialogIsOpen: (value: string | null) => void;
  refetchProjects: () => void;
}

export default function ProjectInvitationDialog({
  dialogIsOpen,
  setDialogIsOpen,
  refetchProjects,
}: props) {
  const { data: userMe } = useGetUserQuery();
  const { data: projectInvitations } = useGetProjectsSharedInvationsQuery();
  const [approveInvitation, { isLoading: isLoadingInvitation }] =
    useApproveProjectSharedInvationMutation();
  const [deleteInvitation, { isLoading: isLoadingDelete }] =
    useDeleteRoleProjectSharedMutation();

  return (
    <>
      {projectInvitations && projectInvitations?.length > 0 && (
        <Dialog
          open={dialogIsOpen}
          onOpenChange={(_el) => setDialogIsOpen(_el ? "invitations" : null)}
        >
          <DialogTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="rounded-full size-6 relative"
            >
              <Bell />
              <Badge className="rounded-full size-4 border-primary absolute -top-2 -right-2.5" variant={"default"}>
                {projectInvitations?.length}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Приглашения на проект</DialogTitle>
            </DialogHeader>
            {projectInvitations.map((el) => (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex flex-col items-start flex-wrap gap-4">
                      <div className="flex justify-between w-full flex-wrap gap-4">
                        <div className="flex flex-col flex-wrap gap-1">
                          <h3 className="text-xs text-gray-400">{`Отправитель:`}</h3>
                          <div className="flex items-center flex-wrap gap-1">
                            <UserAvatar
                              size="xs"
                              name={el?.project?.user?.name || ''}
                              planId={SUBSCRIPTION.FREE}
                            />
                            <span>{el?.project?.user?.name || ''}</span>
                          </div>
                        </div>
                        <div className="flex flex-col flex-wrap gap-1">
                          <h3 className="text-xs text-gray-400">{`Роль:`}</h3>
                          <div className="flex items-center flex-wrap gap-1">
                            <RoleBadge role={el.role} />
                          </div>
                        </div>
                        <div className="flex flex-col flex-wrap gap-1">
                          <h3 className="text-xs text-gray-400">{`Ставка:`}</h3>
                          <div className="flex items-center flex-wrap gap-1">
                            <span>
                              {el?.currency?.symbol}
                              {el?.rate}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col flex-wrap gap-1">
                          <h3 className="text-xs text-gray-400">{`Проект:`}</h3>
                          <div className="flex items-center flex-wrap gap-1">
                            <span>{el?.project?.user?.name || ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardFooter className="self-end">
                  <div className="flex items-center gap-2">
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      isLoading={isLoadingDelete}
                      disabled={isLoadingDelete}
                      onClick={() => {
                        deleteInvitation({
                          project_id: el?.project_id,
                          user_id: userMe?.user_id || "",
                        });
                        setDialogIsOpen(null);
                      }}
                    >
                      Отклонить
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"secondary"}
                      isLoading={isLoadingInvitation}
                      disabled={isLoadingInvitation}
                      onClick={() => {
                        approveInvitation({ project_id: el?.project_id })
                          .unwrap()
                          .then(() => refetchProjects());
                        setDialogIsOpen(null);
                      }}
                    >
                      Принять
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
