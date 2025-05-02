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
  useUpdateTaskStatusMutation,
} from "@/shared/api/task.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import {
  Task,
  TaskStatusColumn,
  UpdateTaskStatusDto,
} from "@/shared/interfaces/task.interface";
import PrivateComponent from "@/widgets/private-component";
import {
  ChartBar,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RateItem from "@/components/rate-item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import UpdateTaskForm from "../forms/update-task.form";
import UserAvatar from "@/components/user-avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  task: Task;
  statusColumns: Array<TaskStatusColumn>;
}

export default function TaskTableRowFeature({ task, statusColumns }: Props) {
  const navigate = useNavigate();
  const [deleteTask] = useDeleteTaskMutation();
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [updateStatus] = useUpdateTaskStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState(
    task?.taskStatus?.taskStatusColumn?.id
  );

  function handleUpdateStatus(dto: UpdateTaskStatusDto) {
    updateStatus(dto);
  }

  useEffect(() => {
    setSelectedStatus(task?.taskStatus?.taskStatusColumn?.id);
  }, [task?.taskStatus?.taskStatusColumn?.id]);

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
        <TaskItem task_id={task.task_id} />
      </TableCell>
      <TableCell className="w-[1/6] ">
        <p>{task?.name}</p>
      </TableCell>
      <TableCell className="w-[1/6]">
        <Select
          value={selectedStatus}
          onValueChange={(value) => {
            setSelectedStatus(value);
            handleUpdateStatus({
              task_id: task.task_id,
              task_status_column_id: value,
            });
          }}
        >
          <SelectTrigger
            className={`w-fit space-x-2 border-0 ring-0 focus:ring-0 focus:ring-offset-0`}
            style={{ borderColor: task?.taskStatus?.taskStatusColumn?.color }}
          >
            <SelectValue placeholder="Выберите статус" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {/* <SelectLabel>Fruits</SelectLabel> */}
              {statusColumns.map((column) => (
                <SelectItem key={column.id} value={column.id} className="">
                  <Badge
                    style={{
                      backgroundColor: column.color || "",
                    }}
                    className="font-medium text-gray-800"
                  >
                    {column.name}
                  </Badge>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="w-[1/6]">
        <RateItem
          symbol={task.currency.symbol}
          rate={task.rate}
          payment_type={task.payment_type}
        />
      </TableCell>
      <TableCell className="w-[1/6]">
        {task.created_at && <p>{new Date(task.created_at).toLocaleString()}</p>}
      </TableCell>
      <TableCell className="w-[1/6]">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-1">
              {task.taskMembers.slice(0, 5).map((el) => (
                <div className="flex items-center gap-2">
                  <UserAvatar
                    size="xs"
                    name={el.user.name}
                    planId={SUBSCRIPTION.FREE}
                  />
                </div>
              ))}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            <ScrollArea className="h-32 w-full rounded-md">
              {task.taskMembers.map((el) => (
                <div className="flex items-center gap-2">
                  <UserAvatar
                    size="xs"
                    name={el.user.name}
                    planId={SUBSCRIPTION.FREE}
                  />
                  <p className="font-semibold text-sm">{el.user.name}</p>
                </div>
              ))}
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
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

            <PrivateComponent
              subscriptions={[
                SUBSCRIPTION.FREE,
                SUBSCRIPTION.BASIC,
                SUBSCRIPTION.PREMIUM,
              ]}
            >
              <DropdownMenuItem
                onClick={() => navigate(`/tasks/${task.task_id}`)}
              >
                <ChartBar className="mr-2 size-4" />
                <span>Статистика</span>
              </DropdownMenuItem>
            </PrivateComponent>

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
