import { ProjectMembers } from "@/shared/interfaces/project.interface";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useState } from "react";
import { Clock, UserRoundPlus, UserRoundX } from "lucide-react";
import { useGetFriendsOnProjectQuery } from "@/shared/api/projects-shared.service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RemoveUserFromProjectDialog from "../remove-user-from-project/remove-user-from-project.dialog";
import InviteUserToProjectDialog from "../invite-user-to-project/invite-user-to-project.dialog";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import ChangeMemberRole from "./change-member-role.dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const { data: friendsOnProject, refetch } = useGetFriendsOnProjectQuery(
    {
      project_id,
    },
    { skip: !project_id }
  );
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [userToAssign, setUserToAssign] = useState<string | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState<
    "add" | "delete" | "change-role" | null
  >(null);

  return (
    <>
      <RemoveUserFromProjectDialog
        user_id={userToRemove || ""}
        project_id={project_id}
        dialogIsOpen={dialogIsOpen === "delete"}
        setDialogIsOpen={(data) => setDialogIsOpen(data ? "delete" : null)}
      />
      <InviteUserToProjectDialog
        project_id={project_id}
        user_id={userToAssign || ""}
        dialogIsOpen={dialogIsOpen === "add"}
        setDialogIsOpen={(data) => {
          setDialogIsOpen(data ? "add" : null);
        }}
      />
      <Sheet
        onOpenChange={(data) => {
          if (data) {
            refetch();
          }
        }}
      >
        <SheetTrigger asChild>
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
        </SheetTrigger>
        <SheetContent>
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
                    <CommandItem className="flex-col gap-1 w-full">
                      <Card className="p-1 w-full">
                        <CardContent className="flex flex-col p-1 w-full gap-1">
                          <div className="flex w-full justify-end">
                            {el?.in_project?.approve === false && (
                              <Badge
                                variant={"outline"}
                                className="flex items-center gap-2"
                              >
                                <Clock className="size-3 text-sky-200" />
                                <p className="text-xs">Запрос отправлен</p>
                              </Badge>
                            )}
                          </div>
                          <div className="flex justify-between gap-1 w-full">
                            <div className="flex gap-2 items-center">
                              <UserAvatar
                                size="xs"
                                name={el.name}
                                planId={SUBSCRIPTION.FREE}
                              />
                              <span>{el.name}</span>
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
                                >
                                  <UserRoundX className="size-4 text-rose-200" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {/* <Separator className="border-1 w-full" /> */}
                          <div className="flex justify-between items-center w-full">
                            <div>
                              {el.in_project !== null && (
                                <ChangeMemberRole
                                  currentRole={el.in_project?.role}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {el.in_project !== null && (
                                <>
                                  <span>
                                    {el?.in_project?.currency?.symbol}
                                    {el?.in_project?.rate}
                                  </span>
                                  <span>{"/"}</span>
                                  <span>
                                    {el.in_project.payment_type ===
                                      PAYMENT.FIXED && "фикс."}
                                    {el.in_project.payment_type ===
                                      PAYMENT.HOURLY && "ч."}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
