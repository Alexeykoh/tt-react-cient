import { useGetTasksByProjectQuery } from "@/shared/api/task.service";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import TaskListItemFeature from "@/features/tasks/task-list-item.feature";

export function TasksListListPage() {
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
      <div className="grid grid-cols-2 gap-4">
        {tasks &&
          tasks?.map((el) => {
            return <TaskListItemFeature {...el} />;
          })}
      </div>
    </div>
  );
}
