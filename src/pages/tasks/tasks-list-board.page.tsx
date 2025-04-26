import { useGetTaskStatusColumnQuery } from "@/shared/api/task.service";
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
import { Card } from "@/components/ui/card";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const {
    data: columns = [],
    isLoading: columnsLoading,
    error: columnsError,
  } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: project,
    error: projectError,
    isLoading: projectLoading,
  } = useGetProjectByIdQuery({ id: id! });

  if (projectLoading || columnsLoading) return <div>Загрузка...</div>;
  if (projectError || columnsError) return <div>Ошибка загрузки данных</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">Добавить задачу</Button>
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

      <div className="flex overflow-x-auto gap-4 pb-4">
        {columns &&
          columns.map((column) => (
            <Card key={column.id} className="flex-shrink-0 w-72 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{column.name}</h3>
                <span className="text-sm text-gray-500">0</span>
              </div>
              <div className="space-y-3">
                {/* Плейсхолдер для будущих задач */}
                <div className="p-3 rounded-md shadow-sm">
                  <div className="h-20 flex items-center justify-center text-gray-400">
                    Задачи появятся здесь
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
