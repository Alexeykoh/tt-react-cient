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
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useState } from "react";
import { Clock, UserRoundPlus, UserRoundX } from "lucide-react";
import RoleBadge from "@/components/role-badge";
import {
  useCreateProjectSharedMutation,
  useDeleteRoleProjectSharedMutation,
  useGetFriendsOnProjectQuery,
} from "@/shared/api/projects-shared.service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

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
  const [selectedStatus, setSelectedStatus] = useState<ProjectRole>(
    ProjectRole.EXECUTOR
  );
  const [dialogIsOpen, setDialogIsOpen] = useState<"add" | "delete" | null>(
    null
  );

  const [remove, { isLoading: isLoadingRemove }] =
    useDeleteRoleProjectSharedMutation();

  const [assign, { isLoading: isLoadingAssign }] =
    useCreateProjectSharedMutation();

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
          setSelectedStatus(ProjectRole.EXECUTOR);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение приглашения</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите пригласить этого пользователя на проект?</p>
          <div>
            <Select
              value={selectedStatus}
              onValueChange={(value: ProjectRole) => {
                setSelectedStatus(value as ProjectRole);
              }}
            >
              <SelectTrigger
                className={`w-fit space-x-2 border-1 ring-0 focus:ring-0 focus:ring-offset-0`}
              >
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {Array.from(Object.values(ProjectRole))
                    .filter((el) => el !== ProjectRole.OWNER)
                    .map((_role) => (
                      <SelectItem key={_role} value={_role} className="">
                        <RoleBadge role={_role} />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(null)}>
              Отмена
            </Button>
            <Button
              variant={"secondary"}
              onClick={async () => {
                setDialogIsOpen(null);
                if (userToAssign && selectedStatus) {
                  await assign({
                    project_id: project_id,
                    user_id: userToAssign,
                    role: selectedStatus,
                  });
                }
              }}
            >
              <span>Пригласить как </span> <RoleBadge role={selectedStatus} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger>
          <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-pointer">
            {friendsOnProject?.filter((el) => el.in_project !== null)
              .length === 0 && <UserRoundPlus className="size-4" />}
            {friendsOnProject?.filter((el) => el.in_project !== null)
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
              {
                friendsOnProject?.filter((el) => el.in_project !== null)
                  .length
              }{" "}
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
                        {el.in_project !== null &&
                          el?.in_project?.approve === true && (
                            <RoleBadge
                              role={el.in_project?.role}
                              showText={false}
                            />
                          )}
                        {el?.in_project?.approve === false && (
                          <Button variant="ghost" size="icon">
                            <Clock className="size-4" />
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
                            disabled={isLoadingAssign}
                            isLoading={isLoadingAssign}
                          >
                            <UserRoundPlus className="size-4" />
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
                            <UserRoundX className="size-4" />
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
