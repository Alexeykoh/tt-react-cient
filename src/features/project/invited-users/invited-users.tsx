import { ProjectMembers } from "@/shared/interfaces/project.interface";
import UserAvatar from "@/components/user-avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useState } from "react";
import { Clock, UserRoundPlus, UserRoundX } from "lucide-react";
import RoleBadge from "@/components/role-badge";
import {
  useDeleteRoleProjectSharedMutation,
  useGetFriendsOnProjectQuery,
} from "@/shared/api/projects-shared.service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import InviteUserToProjectForm from "../forms/invite-user-to-project.form";

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
  const { data: friendsOnProject } = useGetFriendsOnProjectQuery({
    project_id,
  });
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [userToAssign, setUserToAssign] = useState<string | null>(null);

  const [dialogIsOpen, setDialogIsOpen] = useState<"add" | "delete" | null>(
    null
  );

  const [remove, { isLoading: isLoadingRemove }] =
    useDeleteRoleProjectSharedMutation();

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
        onOpenChange={(data) => {
          setDialogIsOpen(data ? "add" : null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение приглашения</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите пригласить этого пользователя на проект?</p>
          <InviteUserToProjectForm
            onSuccess={() => {
              setDialogIsOpen(null);
            }}
            onClose={() => {
              setDialogIsOpen(null);
            }}
            project_id={project_id}
            user_id={userToAssign || ""}
            memberRate={0}
          />
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger>
          <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-pointer">
            {friendsOnProject?.filter((el) => el.in_project !== null).length ===
              0 && <UserRoundPlus className="size-4" />}
            {friendsOnProject
              ?.filter((el) => el.in_project !== null)
              .slice(0, max)
              .map((el) => (
                <div
                  className={`${el.in_project?.approve ? "" : "opacity-50 grayscale-100"}`}
                >
                  <UserAvatar
                    size="xs"
                    name={el.name}
                    planId={SUBSCRIPTION.FREE}
                  />
                </div>
              ))}
            {members.length > max && <p>{`+${members.length - max}`}</p>}
          </div>
        </PopoverTrigger>
        <PopoverContent className="space-y-4 p-0">
          <div className="px-3 py-1">
            <div className="flex justify-between items-center">
              <span>Участники проекта</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {friendsOnProject?.filter((el) => el.in_project !== null).length}{" "}
              участников проекта
            </p>
          </div>
          {friendsOnProject && (
            <Command>
              <CommandInput placeholder="Поиск пользователей" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandSeparator />

                <CommandGroup heading="Ваши друзья">
                  {friendsOnProject?.map((el) => (
                    <CommandItem className="justify-between">
                      <div className="flex gap-2 items-center">
                        <UserAvatar
                          size="xs"
                          name={el.name}
                          planId={SUBSCRIPTION.FREE}
                        />
                        <span>{el.name}</span>
                        {el.in_project !== null && (
                          <RoleBadge
                            role={el.in_project?.role}
                            showText={false}
                          />
                        )}
                        {el?.in_project?.approve === false && (
                          <Button variant="ghost" size="icon">
                            <Clock className="size-4 text-sky-200" />
                          </Button>
                        )}
                      </div>
                      <div>
                        {el.in_project === null && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToAssign(el.user_id);
                              setDialogIsOpen("add");
                            }}
                          >
                            <UserRoundPlus className="size-4 text-emerald-200" />
                          </Button>
                        )}

                        {el.in_project !== null && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToRemove(el.user_id);
                              setDialogIsOpen("delete");
                            }}
                            disabled={isLoadingRemove}
                            isLoading={isLoadingRemove}
                          >
                            <UserRoundX className="size-4 text-rose-200" />
                          </Button>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
