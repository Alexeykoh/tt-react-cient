import { ProjectMembers } from "@/shared/interfaces/project.interface";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useState } from "react";
import {
  Clock,
  MoreVerticalIcon,
  UserRoundPen,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RemoveUserFromProjectDialog from "../remove-user-from-project/remove-user-from-project.dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InviteUserToProjectDialog from "../invite-user-to-project/invite-user-to-project.dialog";
import { Separator } from "@/components/ui/separator";
import RoleBadge from "@/components/role-badge";
import PaymentType from "@/shared/ui/payment-type";
import EditProjectMemberDialog from "../edit-project.member.dialog";

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
  const [memberToEdit, setMemberToEdit] = useState<string | null>(null);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [userToAssign, setUserToAssign] = useState<string | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState<
    "add" | "delete" | "edit" | null
  >(null);

  return (
    <>
      <EditProjectMemberDialog
        dialogIsOpen={dialogIsOpen === "edit"}
        setDialogIsOpen={(data) => setDialogIsOpen(data ? "edit" : null)}
        project_id={project_id}
        member_id={memberToEdit || ""}
      />
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
                  key={el.user_id}
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
                          <div className="flex justify-between gap-1 w-full px-2">
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex w-full justify-between gap-1">
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
                                    <>
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        onClick={() => {
                                          setUserToAssign(el.user_id);
                                          setDialogIsOpen("add");
                                        }}
                                      >
                                        <UserRoundPlus className="size-4 text-emerald-200" />
                                      </Button>
                                    </>
                                  )}
                                  {el.in_project !== null && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="flex size-6 text-muted-foreground data-[state=open]:bg-muted ml-auto"
                                          size="icon"
                                        >
                                          <MoreVerticalIcon />
                                        </Button>
                                      </DropdownMenuTrigger>

                                      <DropdownMenuContent align="end">
                                        {el.in_project !== null && (
                                          <>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setMemberToEdit(
                                                  el?.in_project?.member_id ? el.in_project.member_id : null
                                                );
                                                setDialogIsOpen("edit");
                                              }}
                                            >
                                              <UserRoundPen className="size-4 text-orange-200" />
                                              <span>Редактировать</span>
                                            </DropdownMenuItem>
                                            <Separator />
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setUserToRemove(el.user_id);
                                                setDialogIsOpen("delete");
                                              }}
                                            >
                                              <UserRoundX className="size-4 text-rose-200" />
                                              <span>Удалить</span>
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                              {el.in_project !== null && (
                                <div className="flex w-full justify-between">
                                  <Badge variant={"outline"}>
                                    {el?.in_project?.currency?.symbol}
                                    {el?.in_project?.rate}
                                    <span>{" / "}</span>
                                    <span>
                                      <PaymentType
                                        type={
                                          el?.in_project?.payment_type || ""
                                        }
                                        varian={"sm"}
                                      />
                                    </span>
                                  </Badge>
                                  <RoleBadge role={el?.in_project?.role} />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex w-full justify-end">
                            {el?.in_project?.approve === false && (
                              <Badge
                                variant={"outline"}
                                className="flex items-center gap-2 border-primary/50"
                              >
                                <Clock className="size-4" />
                                <p className="text-xs">Запрос отправлен</p>
                              </Badge>
                            )}
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
