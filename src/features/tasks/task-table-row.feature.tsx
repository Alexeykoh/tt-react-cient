import TaskItem from "@/components/task-item";
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
import { TableCell } from "@/components/ui/table";
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateTaskForm from "./update-task.form";
import RateItem from "@/components/rate-item";

export default function TaskTableRowFeature(task: Task) {
  const navigate = useNavigate();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  return (
    <>
      {task && (
        <>
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
                <Button
                  variant="outline"
                  onClick={() => setProjectToDelete(null)}
                >
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
        </>
      )}
      <TableCell className="font-medium w-[1/6] flex items-center gap-4">
        <PrivateComponent
          subscriptions={[SUBSCRIPTION.BASIC, SUBSCRIPTION.PREMIUM]}
        >
          <Button
            size={"icon"}
            onClick={() => navigate(`/tasks/${task.task_id}`)}
            variant={"default"}
          >
            <PanelTopOpen />
          </Button>
        </PrivateComponent>
        <TaskItem task_id={task.task_id} />
      </TableCell>
      <TableCell className="w-[1/6] ">
        <p>{task?.name}</p>
      </TableCell>
      <TableCell className="w-[1/6]">
        <RateItem
          symbol={task.currency.symbol}
          rate={task.rate}
          payment_type={task.payment_type}
        />
      </TableCell>
      <TableCell className="w-[1/6]">
        {task && (
          <Button
            onClick={() => {
              updateTask({
                taskId: task.task_id,
                updateData: { is_paid: !task?.is_paid },
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
      </TableCell>
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
              onClick={() => setProjectToDelete(task.task_id)}
            >
              <TrashIcon className="mr-2 size-4" />
              <span>Удалить</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
