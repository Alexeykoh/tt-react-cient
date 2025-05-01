import React, { useMemo, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
} from "@/shared/api/projects.service";
import { formatDate } from "@/lib/dateUtils";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  HandCoins,
  Kanban,
  List,
  MoreVerticalIcon,
  PencilIcon,
  Table,
  TrashIcon,
  User,
  UserRoundPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProjectForm from "@/features/project/EditProjectForm";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import extractLetterFromPath from "@/lib/extractPageView";
import { Separator } from "@/components/ui/separator";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";
import UserAvatar from "@/components/user-avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGetFriendshipMeQuery } from "@/shared/api/friendship.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useCreateProjectSharedMutation } from "@/shared/api/projects-shared.service";
import { ProjectRole } from "@/shared/enums/project-role.enum";

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const { data: friendsMe } = useGetFriendshipMeQuery();
  const [inviteToProject] = useCreateProjectSharedMutation();
  const currentPageView = useMemo(
    () => extractLetterFromPath(location.pathname),
    [location.pathname]
  );

  const [deleteProject] = useDeleteProjectMutation();
  const [dialogIsOpen, setDialogIsOpen] = useState<
    "create" | "edit" | "delete" | "invite" | null
  >(null);
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectByIdQuery({ id: id! });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки проекта</div>;

  return (
    <>
      <Dialog
        open={dialogIsOpen === "edit"}
        onOpenChange={(data) => setDialogIsOpen(data ? "edit" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
          </DialogHeader>
          <EditProjectForm
            projectId={project?.project_id || ""}
            initialData={{
              name: project?.name || "",
              currency_id: project?.currency.code || "",
              rate: parseFloat(project?.rate || ""),
              client_id: project?.client?.client_id,
              tag_ids: [],
            }}
            onSuccess={() => setDialogIsOpen(null)}
            onClose={() => setDialogIsOpen(null)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialogIsOpen === "delete"}
        onOpenChange={(data) => setDialogIsOpen(data ? "delete" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этот проект?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                navigate("/projects");
                setDialogIsOpen(null);
                await deleteProject(id || "");
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogIsOpen === "invite"}
        onOpenChange={(data) => setDialogIsOpen(data ? "invite" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пригласить пользователя</DialogTitle>
          </DialogHeader>
          <p>Выберите из списка друзей</p>
          <div className="flex space-x-2 mt-4">
            {friendsMe?.map((friend) => (
              <Button
                key={friend.friend.user_id}
                variant="outline"
                onClick={() => {
                  setDialogIsOpen(null);
                  inviteToProject({
                    project_id: id || "",
                    user_id: friend.friend.user_id,
                    role: ProjectRole.EXECUTOR,
                  });
                }}
              >
                <UserAvatar
                  size="xs"
                  name={friend?.friend?.name}
                  planId={SUBSCRIPTION.FREE}
                />
                <p>{friend?.friend?.name}</p>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full h-full flex flex-col">
        <div className="w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex flex-row border-b-2 w-full p-4 justify-between items-center">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-4">
                    <Button
                      className="size-6"
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => navigate(`/${ROUTES.PROJECTS}`)}
                    >
                      <ChevronLeft />
                    </Button>
                    <div className="flex gap-4 text-xl font-bold items-center">
                      <p className="uppercase">{project?.name}</p>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-6 text-muted-foreground data-[state=open]:bg-muted ml-auto"
                              size="icon"
                            >
                              <MoreVerticalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => {
                                setDialogIsOpen("edit");
                              }}
                            >
                              <PencilIcon className="mr-2 size-4" />
                              <span>Редактировать</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setDialogIsOpen("invite");
                              }}
                            >
                              <UserRoundPlus className="mr-2 size-4" />
                              <span>Пригласить</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDialogIsOpen("delete")}
                            >
                              <TrashIcon className="mr-2 size-4" />
                              <span>Удалить</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap text-gray-400 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <p>{project?.client?.name || "Не указан"}</p>
                    </div>
                    <Separator orientation="vertical" className="border-1" />
                    <div className="flex items-center gap-2">
                      <HandCoins className="w-4 h-4" />
                      <p>
                        {project?.currency?.symbol}
                        {project?.rate}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="border-1" />
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <p>{formatDate(project?.created_at || "")}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-row gap-2">
                    {project?.members?.map((el) => {
                      return (
                        <div className="relative">
                          <HoverCard>
                            <HoverCardTrigger>
                              <div>
                                <UserAvatar
                                  size="xs"
                                  name={el.user?.name || ""}
                                  planId={
                                    el.user?.subscriptions[0]?.planId || ""
                                  }
                                />
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit">
                              <div className="flex gap-2 items-center">
                                <p>{el.user?.name}</p>
                                <Separator
                                  orientation="vertical"
                                  className="min-h-5"
                                />
                                <p>{el.role}</p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      );
                    })}
                  </div>
                  <Dialog
                    open={dialogIsOpen === "create"}
                    onOpenChange={(data) =>
                      setDialogIsOpen(data ? "create" : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button size={"sm"} className="w-fit">
                        Добавить задачу
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создать новую задачу</DialogTitle>
                      </DialogHeader>
                      <CreateTaskForm
                        onSuccess={() => setDialogIsOpen(null)}
                        onClose={() => setDialogIsOpen(null)}
                        projectId={project?.project_id || ""}
                        projectRate={Number(project?.rate) || 0}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4">
                <Link to={`/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}/${id}`}>
                  <Button
                    size={"sm"}
                    variant={
                      currentPageView === TASKS_VIEW.TABLE ? "outline" : "ghost"
                    }
                  >
                    <Table />
                    <span>Таблица</span>
                  </Button>
                </Link>
                <Link to={`/${ROUTES.PROJECTS}/${TASKS_VIEW.LIST}/${id}`}>
                  <Button
                    size={"sm"}
                    variant={
                      currentPageView === TASKS_VIEW.LIST ? "outline" : "ghost"
                    }
                  >
                    <List />
                    <span>Список</span>
                  </Button>
                </Link>
                <Link to={`/${ROUTES.PROJECTS}/${TASKS_VIEW.BOARD}/${id}`}>
                  <Button
                    size={"sm"}
                    variant={
                      currentPageView === TASKS_VIEW.BOARD ? "outline" : "ghost"
                    }
                  >
                    <Kanban />
                    <span>Доска</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Рендер списка задач в зависимости от выбранного вида представления */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;
