import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/shared/api/task.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { Task } from "@/shared/interfaces/task.interface";
import PrivateComponent from "@/widgets/private-component";
import {
  Check,
  Loader,
  MoreVerticalIcon,
  PanelTopOpen,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RateItem from "@/components/rate-item";
import UpdateTaskForm from "../forms/update-task.form";
import TimeLogsTimer from "@/features/time-logs/time-logs-timer";

export default function TaskListItemFeature(task: Task) {
  const navigate = useNavigate();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  return (
    <>
      {/* Диалоги остаются без изменений */}
      <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Обновить задачу</DialogTitle>
          </DialogHeader>
          <UpdateTaskForm
            onSuccess={() => setEditDialogIsOpen(false)}
            onClose={() => setEditDialogIsOpen(false)}
            defaults={{
              name: task.name,
              description: task.description,
              is_paid: task.is_paid,
              payment_type: task.payment_type,
              rate: String(task.rate),
              currency_id: String(task.currency.currency_id || ""),
            }}
            taskId={task?.task_id}
            currency={task?.currency}
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
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteTask(task.task_id);
                setProjectToDelete(null);
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Основная карточка */}
      <Card className="hover:shadow-md transition-shadow w-full">
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <TimeLogsTimer.Root task_id={task.task_id} variant="icon" />
              <CardTitle className="text-lg">{task.name}</CardTitle>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-2 -mr-2"
                >
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogIsOpen(true)}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setProjectToDelete(task.task_id)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <RateItem
              symbol={task.currency.symbol}
              rate={task.rate}
              payment_type={task.payment_type}
            />

            {task && (
              <Button
                onClick={() => {
                  updateTask({
                    taskId: task.task_id,
                    updateData: { is_paid: !task?.is_paid },
                    projectId: task?.project_id || "",
                  });
                }}
                variant={task?.is_paid ? "default" : "destructive"}
                className="bg-emerald-400"
              >
                {task?.is_paid ? (
                  <>
                    <Check /> Оплачен
                  </>
                ) : (
                  <>
                    <Loader />
                    не оплачен
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <PrivateComponent
            subscriptions={[SUBSCRIPTION.BASIC, SUBSCRIPTION.PREMIUM]}
          >
            <Button
              variant="outline"
              onClick={() => navigate(`/tasks/${task.task_id}`)}
            >
              <PanelTopOpen className="mr-2 h-4 w-4" />
              Подробнее
            </Button>
          </PrivateComponent>
        </CardFooter>
      </Card>
    </>
  );
}
