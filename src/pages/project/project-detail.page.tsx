import React, { useEffect, useMemo, useState } from "react";
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
  LogOut,
  MoreVerticalIcon,
  PencilIcon,
  Table,
  TrashIcon,
  User,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProjectForm from "@/features/project/forms/edit-project.form";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import extractLetterFromPath from "@/lib/extractPageView";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import InvitedUsers from "@/features/project/invited-users/invited-users";
import { useGetUserQuery } from "@/shared/api/user.service";
import RoleComponent from "@/widgets/role-component";
import RoleBadge from "@/components/role-badge";
import { ProjectMembers } from "@/shared/interfaces/project.interface";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import LeaveProjectDialog from "@/features/project/leave-project.dialog";

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [meData, setMeData] = useState<ProjectMembers | null>(null);

  const { data: userMe } = useGetUserQuery();
  const currentPageView = useMemo(
    () => extractLetterFromPath(location.pathname),
    [location.pathname]
  );

  const [deleteProject] = useDeleteProjectMutation();
  const [dialogIsOpen, setDialogIsOpen] = useState<
    "create" | "edit" | "delete" | "invite" | "leave" | null
  >(null);
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectByIdQuery({ id: id! });

  useEffect(() => {
    const owner = project?.members?.find(
      (el) => el.role === PROJECT_ROLE.OWNER
    );
    const me = project?.members?.find(
      (el) => el.user.user_id === userMe?.user_id
    );
    if (owner && me) {
      setMeData(me);
    }
  }, [project?.members, userMe?.user_id]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки проекта</div>;

  return (
    <>
      <LeaveProjectDialog
        project_id={project?.project_id || ""}
        member_id={
          project?.members.find((el) => el.user.user_id === userMe?.user_id)
            ?.member_id || ""
        }
        dialogIsOpen={dialogIsOpen === "leave"}
        setDialogIsOpen={(data) => setDialogIsOpen(data ? "leave" : null)}
        projectRefetch={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
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
          <p className="text-gray-400">
            Все приглашенные пользователи получат уведомление об удалении
            проекта.
          </p>
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
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <RoleComponent
                              roles={[PROJECT_ROLE.OWNER]}
                              userRole={
                                project?.members.find(
                                  (m) => m.user?.user_id === userMe?.user_id
                                )?.role as PROJECT_ROLE
                              }
                              showChildren={false}
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  setDialogIsOpen("edit");
                                }}
                              >
                                <PencilIcon className="mr-2 size-4" />
                                <span>Редактировать</span>
                              </DropdownMenuItem>
                            </RoleComponent>

                            <RoleComponent
                              roles={[PROJECT_ROLE.OWNER]}
                              userRole={
                                project?.members.find(
                                  (m) => m.user?.user_id === userMe?.user_id
                                )?.role as PROJECT_ROLE
                              }
                              showChildren={false}
                            >
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDialogIsOpen("delete")}
                              >
                                <TrashIcon className="mr-2 size-4" />
                                <span>Удалить</span>
                              </DropdownMenuItem>
                            </RoleComponent>

                            <RoleComponent
                              roles={[
                                PROJECT_ROLE.GUEST,
                                PROJECT_ROLE.EXECUTOR,
                                PROJECT_ROLE.MANAGER,
                              ]}
                              userRole={
                                project?.members.find(
                                  (m) => m.user?.user_id === userMe?.user_id
                                )?.role as PROJECT_ROLE
                              }
                              showChildren={false}
                            >
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDialogIsOpen("leave")}
                              >
                                <LogOut className="mr-2 size-4" />
                                <span>Покинуть проект</span>
                              </DropdownMenuItem>
                            </RoleComponent>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap text-gray-400 text-xs items-center">
                    <div className="flex items-center gap-2">
                      <RoleBadge
                        role={
                          project?.members.find(
                            (el) => el.user?.user_id === userMe?.user_id
                          )?.role
                        }
                      />
                    </div>
                    <RoleComponent
                      roles={[PROJECT_ROLE.OWNER, PROJECT_ROLE.MANAGER]}
                      userRole={
                        project?.members.find(
                          (m) => m.user?.user_id === userMe?.user_id
                        )?.role as PROJECT_ROLE
                      }
                      showChildren={false}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <p>{project?.client?.name || "Не указан"}</p>
                      </div>
                    </RoleComponent>
                    {meData && (
                      <RoleComponent
                        roles={[
                          PROJECT_ROLE.OWNER,
                          PROJECT_ROLE.MANAGER,
                          PROJECT_ROLE.EXECUTOR,
                        ]}
                        userRole={meData?.role}
                        showChildren={false}
                      >
                        <div className="flex items-center gap-2">
                          <HandCoins className="w-4 h-4" />
                          <p>
                            {meData?.currency?.symbol}
                            {meData?.rate}
                          </p>
                          <span> {"/"}</span>
                          <p>
                            {meData?.payment_type === PAYMENT.FIXED &&
                              "Фиксированная ставка"}
                            {meData?.payment_type === PAYMENT.HOURLY &&
                              "Почасовая оплата"}
                          </p>
                        </div>
                      </RoleComponent>
                    )}

                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <p>{formatDate(project?.created_at || "")}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RoleComponent
                    roles={[PROJECT_ROLE.OWNER, PROJECT_ROLE.MANAGER]}
                    userRole={
                      project?.members.find(
                        (m) => m.user?.user_id === userMe?.user_id
                      )?.role as PROJECT_ROLE
                    }
                    showChildren={false}
                  >
                    <div className="flex flex-row gap-1">
                      <InvitedUsers
                        members={project?.members || []}
                        project_id={project?.project_id || ""}
                      />
                    </div>
                  </RoleComponent>

                  <Dialog
                    open={dialogIsOpen === "create"}
                    onOpenChange={(data) =>
                      setDialogIsOpen(data ? "create" : null)
                    }
                  >
                    <RoleComponent
                      roles={[PROJECT_ROLE.OWNER, PROJECT_ROLE.MANAGER]}
                      userRole={
                        project?.members.find(
                          (m) => m.user?.user_id === userMe?.user_id
                        )?.role as PROJECT_ROLE
                      }
                      showChildren={false}
                    >
                      <DialogTrigger asChild>
                        <Button size={"sm"} className="w-fit">
                          Добавить задачу
                        </Button>
                      </DialogTrigger>
                    </RoleComponent>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создать новую задачу</DialogTitle>
                      </DialogHeader>
                      <CreateTaskForm
                        onSuccess={() => setDialogIsOpen(null)}
                        onClose={() => setDialogIsOpen(null)}
                        projectId={project?.project_id || ""}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4">
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
