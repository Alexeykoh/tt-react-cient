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
import { CardContent } from "@/components/ui/card";
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
import { ROUTES, VIEW_ROUTES } from "@/app/router/routes.enum";
import extractLetterFromPath from "@/lib/extractPageView";
import { Separator } from "@/components/ui/separator";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPageView = useMemo(
    () => extractLetterFromPath(location.pathname),
    [location.pathname]
  );

  const { id } = useParams<{ id: string }>();
  const [deleteProject] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectByIdQuery({ id: id! });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки проекта</div>;

  return (
    <>
      {project && (
        <>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Редактировать проект</DialogTitle>
              </DialogHeader>
              <EditProjectForm
                projectId={project?.project_id}
                initialData={{
                  name: project?.name,
                  currency_id: project?.currency.code,
                  rate: parseFloat(project?.rate),
                  client_id: project?.client?.client_id,
                  tag_ids: [],
                }}
                onSuccess={() => setEditDialogIsOpen(false)}
                onClose={() => setEditDialogIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={projectToDelete !== null}
            onOpenChange={() => setProjectToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
              </DialogHeader>
              <p>Вы уверены, что хотите удалить этот проект?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setProjectToDelete(null)}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    navigate("/projects");
                    await deleteProject(id || "");
                    setProjectToDelete(null);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <div className="w-full h-full flex flex-col gap-4">
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
                                setEditDialogIsOpen(true);
                              }}
                            >
                              <PencilIcon className="mr-2 size-4" />
                              <span>Редактировать</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setProjectToDelete(id || "")}
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
                <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
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
                      onSuccess={() => setDialogIsOpen(false)}
                      onClose={() => setDialogIsOpen(false)}
                      projectId={project?.project_id || ""}
                      projectRate={Number(project?.rate) || 0}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center gap-2 p-4">
                <Link to={`/${ROUTES.PROJECTS}/${VIEW_ROUTES.TABLE}/${id}`}>
                  <Button
                    size={"sm"}
                    variant={
                      currentPageView === VIEW_ROUTES.TABLE
                        ? "outline"
                        : "ghost"
                    }
                  >
                    <Table />
                    <span>Таблица</span>
                  </Button>
                </Link>
                <Link to={`/${ROUTES.PROJECTS}/${VIEW_ROUTES.LIST}/${id}`}>
                  <Button
                    size={"sm"}
                    variant={
                      currentPageView === VIEW_ROUTES.LIST ? "outline" : "ghost"
                    }
                  >
                    <List />
                    <span>Список</span>
                  </Button>
                </Link>
                <Link to={`/${ROUTES.PROJECTS}/${VIEW_ROUTES.BOARD}/${id}`}>
                  <Button
                    size={"sm"}
                    variant={
                      currentPageView === VIEW_ROUTES.BOARD
                        ? "outline"
                        : "ghost"
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

        <div className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col gap-4">
            {/* Рендер списка задач в зависимости от выбранного вида представления */}
            <Outlet />
          </CardContent>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;
