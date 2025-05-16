import { useState } from "react";
import { TaskMember } from "@/shared/interfaces/task.interface";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { Button } from "@/components/ui/button";
import { Plus, Trash, UserRoundPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAssignUserToTaskMutation } from "@/shared/api/task.service";
import { useGetUserQuery } from "@/shared/api/user.service";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectShared } from "@/shared/interfaces/project-shared.interface";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import RemoveUserFromTaskDialog from "../remove-user-from-task/remove-user-from-tasl.dialog";

interface props {
  projectMembers: ProjectShared[];
  taskMembers: TaskMember[];
  taskId: string;
  max?: number;
}

export default function TaskSharedUsers({
  projectMembers,
  taskMembers,
  max = 2,
  taskId,
}: props) {
  const { data: userMe } = useGetUserQuery();
  const [dialogIsOpen, setDialogIsOpen] = useState<"add" | "delete" | null>(
    null
  );

  const [userToRemove, setUserToRemove] = useState<string | null>(null);

  const [assign, { isLoading: isLoadingAssign }] =
    useAssignUserToTaskMutation();

  return (
    <div className="flex items-center gap-1 py-2">
      <RemoveUserFromTaskDialog
        user_id={userToRemove || ""}
        task_id={taskId}
        dialogIsOpen={dialogIsOpen === "delete"}
        setDialogIsOpen={(data) => setDialogIsOpen(data ? "delete" : null)}
      />

      <Popover>
        <PopoverTrigger>
          <div
            className={`flex items-center text-xs text-muted-foreground gap-1 cursor-pointer`}
          >
            {taskMembers.length === 0 && <UserRoundPlus className="size-4" />}
            {taskMembers.slice(0, max).map((el) => (
              <div
                key={el.member_id}
                className={`${projectMembers.find((_el) => _el.user_id === el.user.user_id)?.approve === false && "grayscale-100"}`}
              >
                <UserAvatar
                  size="xs"
                  name={el.user.name}
                  planId={SUBSCRIPTION.FREE}
                  metaText={
                    projectMembers.find(
                      (_el) => _el.user_id === el.user.user_id
                    )?.approve === false
                      ? "Снят с проекта"
                      : ""
                  }
                />
              </div>
            ))}
            {taskMembers.length > max && (
              <p>{`+${taskMembers.length - max}`}</p>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <div className="flex justify-between">
              <span>Участники задачи</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {taskMembers.length} участников задачи
            </p>
          </div>
          <div className="flex flex-col text-xs text-muted-foreground gap-1 py-4">
            <ScrollArea className="h-64 w-full">
              {projectMembers
                .filter((el) => el.role !== PROJECT_ROLE.OWNER)
                .map((el) => (
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        size="xs"
                        name={el.user.name}
                        planId={SUBSCRIPTION.FREE}
                      />
                      <p>{el.user.name}</p>
                    </div>
                    <div>
                      {taskMembers?.find(
                        (_el) => _el.user.user_id === el.user.user_id
                      ) ? (
                        <>
                          {userMe?.user_id !== el.user.user_id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setUserToRemove(el.user.user_id);
                                setDialogIsOpen("delete");
                              }}
                              disabled={isLoadingAssign}
                              isLoading={isLoadingAssign}
                            >
                              <Trash className="size-4 " />
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            assign({
                              taskId,
                              userData: {
                                taskId: taskId,
                                userId: el.user.user_id,
                              },
                            });
                          }}
                        >
                          <Plus className="size-4" />
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
    </div>
  );
}
