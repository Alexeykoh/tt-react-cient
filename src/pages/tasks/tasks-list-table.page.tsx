import {
  useGetTasksByProjectQuery,
  useGetTaskStatusColumnQuery,
} from "@/shared/api/task.service";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "@/features/tasks/create-task.form";
import { useGetProjectByIdQuery } from "@/shared/api/projects.service";
import TaskTableRowFeature from "@/features/tasks/task-table-row.feature";

export function TasksListTablePage() {
  const { id } = useParams<{ id: string }>();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const { data: tasks } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectByIdQuery({ id: id! });

  const { data: columns = [] } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки проекта</div>;

  return (
    <div>
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
              projectRate={Number(project?.rate) || 0}
            />
          </DialogContent>
        </Dialog>
      )}

      <Table className="flex-1 w-full ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[1/6]"></TableHead>
            <TableHead className="w-[1/6]">Наименование</TableHead>
            <TableHead className="w-[1/6]">Статус</TableHead>
            <TableHead className="w-[1/6]">Ставка</TableHead>
            <TableHead className="w-[1/6]">Дата</TableHead>
            <TableHead className="w-[1/6]">Оплата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex-1">
          {tasks &&
            tasks?.map((el) => {
              return (
                <TableRow key={el.task_id}>
                  <TaskTableRowFeature task={el} statusColumns={columns} />
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
