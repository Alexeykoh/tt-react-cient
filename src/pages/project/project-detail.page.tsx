import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
} from "@/shared/api/projects.service";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/dateUtils";
import { useGetTasksByProjectQuery } from "@/shared/api/task.service";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  HandCoins,
  MoreVerticalIcon,
  PencilIcon,
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
import CreateTaskForm from "@/features/tasks/create-task.form";
import TaskTableRowFeature from "@/features/tasks/task-table-row.feature";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [deleteProject] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectByIdQuery({ id: id! });
  const { data: tasks } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

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

      <div className="container mx-auto p-4 flex flex-col gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center space-between gap-4">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  size={"icon"}
                  variant={"default"}
                  onClick={() => navigate("/projects")}
                >
                  <ChevronLeft />
                </Button>
                <div className="flex gap-4 text-2xl font-bold">
                  <p>{project?.name}</p>
                  <div className="flex justify-end pr-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted ml-auto"
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
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <p>Клиент: {project?.client?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <HandCoins className="w-4 h-4" />
              <p>
                Ставка: {project?.currency?.symbol}
                {project?.rate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <p>Дата создания: {formatDate(project?.created_at || "")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            {project && (
              <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                <DialogTrigger asChild>
                  <Button className="w-fit">Добавить задачу</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать новый проект</DialogTitle>
                  </DialogHeader>
                  <CreateTaskForm
                    onSuccess={() => setDialogIsOpen(false)}
                    onClose={() => {}}
                    projectId={project?.project_id}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Table className="flex-1 w-full ">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[1/6]"></TableHead>
                  <TableHead className="w-[1/6]">Наименование</TableHead>
                  <TableHead className="w-[1/6]">Ставка</TableHead>
                  <TableHead className="w-[1/6]">Статус</TableHead>
                  {/* <TableHead className="w-[15%]"></TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody className="flex-1">
                {tasks &&
                  tasks?.map((el) => {
                    return (
                      <TableRow key={el.task_id}>
                        <TaskTableRowFeature {...el} />
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProjectDetailPage;
