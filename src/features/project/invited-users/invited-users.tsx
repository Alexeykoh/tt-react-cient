import { ProjectMembers } from "@/shared/interfaces/project.interface";
import UserAvatar from "@/components/user-avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProjectRole } from "@/shared/enums/project-role.enum";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useGetUserQuery } from "@/shared/api/user.service";
import { useState } from "react";
import { UserRoundPlus, UserRoundX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RoleBadge from "@/components/role-badge";
import {
  useChangeRoleProjectSharedMutation,
  useDeleteRoleProjectSharedMutation,
} from "@/shared/api/projects-shared.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetFriendshipMeQuery } from "@/shared/api/friendship.service";

interface InvitedUsersProps {
  members: Array<ProjectMembers>;
  project_id: string;
  max?: number;
}

export default function InvitedUsers({
  members,
  max = 5,
  project_id,
}: InvitedUsersProps) {
  const { data: userMe } = useGetUserQuery();
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [userToAssign, setUserToAssign] = useState<string | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState<"add" | "delete" | null>(
    null
  );
  const { data: friendsMe } = useGetFriendshipMeQuery();

  const [remove, { isLoading: isLoadingRemove }] =
    useDeleteRoleProjectSharedMutation();

  const [assign, { isLoading: isLoadingAssign }] =
    useChangeRoleProjectSharedMutation();

  return (
    <>
      <Dialog
        open={dialogIsOpen === "delete"}
        onOpenChange={(data) => setDialogIsOpen(data ? "delete" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этого пользователя с проекта?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setDialogIsOpen(null);
                if (userToRemove) {
                  await remove({
                    project_id: project_id,
                    user_id: userToRemove,
                  });
                }
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialogIsOpen === "add"}
        onOpenChange={(data) => setDialogIsOpen(data ? "add" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Приглошение пользователя на проект</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col text-xs text-muted-foreground gap-1 py-4">
            <ScrollArea className="h-64 w-full">
              {friendsMe?.map((el) => (
                <div className="flex items-center gap-2 justify-between h-8">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      size="xs"
                      name={el.friend.name}
                      planId={SUBSCRIPTION.FREE}
                    />
                    <p>{el.friend.name}</p>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setUserToAssign(el.friend.user_id);
                      }}
                      disabled={isLoadingAssign}
                      isLoading={isLoadingAssign}
                    >
                      <UserRoundPlus className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select> */}
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger>
          <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-pointer">
            {members.length === 0 && <UserRoundPlus className="size-4" />}
            {members.slice(0, max).map((el) => (
              <UserAvatar
                size="xs"
                name={el.user.name}
                planId={SUBSCRIPTION.FREE}
              />
            ))}
            {members.length > max && <p>{`+${members.length - max}`}</p>}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <div className="flex justify-between items-center">
              <span>Участники проекта</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDialogIsOpen("add");
                }}
                disabled={isLoadingAssign}
                isLoading={isLoadingAssign}
              >
                <UserRoundPlus className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {members.length} участников проекта
            </p>
          </div>
          <div className="flex flex-col text-xs text-muted-foreground gap-1 py-4">
            <ScrollArea className="h-64 w-full">
              {members.map((el) => (
                <div className="flex items-center gap-2 justify-between h-8">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      size="xs"
                      name={el.user.name}
                      planId={SUBSCRIPTION.FREE}
                    />
                    <p>{el.user.name}</p>
                    <RoleBadge role={el.role} showText={false} />
                  </div>
                  <div>
                    {members?.find(
                      (_el) => _el.user.user_id === el.user.user_id
                    ) ? (
                      <>
                        {el.role !== ProjectRole.OWNER && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToRemove(el.user.user_id);
                              setDialogIsOpen("delete");
                            }}
                            disabled={isLoadingRemove}
                            isLoading={isLoadingRemove}
                          >
                            <UserRoundX className="size-4" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setUserToAssign(el.user.user_id);
                          setDialogIsOpen("add");
                        }}
                        disabled={isLoadingAssign}
                        isLoading={isLoadingAssign}
                      >
                        <UserRoundPlus className="size-4" />
                      </Button>
                    )}

                    {userMe?.user_id === el.user.user_id && (
                      <Badge>{"Вы"}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
