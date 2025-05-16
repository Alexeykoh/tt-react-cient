import { createContext, useContext, ReactNode } from "react";
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
import { TableCell, TableRow } from "@/components/ui/table";
import {
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} from "@/shared/api/task.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import {
  PAYMENT,
  Task,
  TaskStatusColumn,
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
import { Currency } from "@/shared/interfaces/currency.interface";
import { useGetProjectSharedByIdQuery } from "@/shared/api/projects-shared.service";
import TimeLogsTimer from "@/features/time-logs/time-logs-timer";
import TaskSharedUsers from "../shared-users/task-shared-users";

type dialogType = "edit" | "delete" | null;

// Определяем тип значения контекста
interface context {
  task_id: string;
  project_id: string;
  name: string;
  description: string;
  is_paid: boolean;
  rate: number;
  color: string;
  symbol: string;
  created_at: string;
  payment_type: PAYMENT;
  currency: Currency;
  task: Task;
  statusColumns: Array<TaskStatusColumn>;
}

// Создаём контекст с типом, по умолчанию null
const TaskCardMainContext = createContext<context | null>(null);

interface props {
  children: ReactNode;
  task: Task;
  statusColumns: Array<TaskStatusColumn>;
}

function Root({ children, ...props }: props) {
  const task = props.task;
  const statusColumns = props.statusColumns;

  const contextProps: context = {
    task_id: task.task_id,
    project_id: task?.project_id || "",
    name: task.name,
    description: task.description,
    is_paid: task.is_paid,
    rate: Number(task.rate),
    color: String(task?.taskStatus?.taskStatusColumn?.color) || "#000000",
    symbol: task.currency.symbol,
    created_at: task.created_at,
    payment_type: task.payment_type,
    currency: task.currency,
    task: task,
    statusColumns: statusColumns,
  };

  return (
    <TaskCardMainContext.Provider value={contextProps}>
      <TableRow key={props.task.project_id}>{children}</TableRow>
    </TaskCardMainContext.Provider>
  );
}

// Хук для удобного использования контекста с проверкой на null
function useContextRoot() {
  const context = useContext(TaskCardMainContext);
  if (!context) {
    throw new Error(
      "useTaskCardMain должен использоваться внутри TaskCardMain.Provider"
    );
  }
  return context;
}

function Items() {
  const { task_id } = useContextRoot();
  return (
    <TableCell className="font-medium w-[1/6] flex items-center gap-4">
      <TimeLogsTimer.Root task_id={task_id} variant="button" />
    </TableCell>
  );
}

function Title() {
  const { name } = useContextRoot();
  return (
    <TableCell className="w-[1/6] ">
      <p>{name}</p>
    </TableCell>
  );
}

function Status() {
  const context = useContextRoot();
  const [updateStatus] = useUpdateTaskStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState(
    context.task?.taskStatus?.taskStatusColumn?.id
  );

  useEffect(() => {
    setSelectedStatus(context.task?.taskStatus?.taskStatusColumn?.id);
  }, [context.task?.taskStatus?.taskStatusColumn?.id]);

  return (
    <TableCell className="w-[1/6]">
      <Select
        value={selectedStatus}
        onValueChange={(value) => {
          setSelectedStatus(value);
          updateStatus({
            task_id: context.task_id,
            task_status_column_id: value,
            projectId: context.project_id,
          });
        }}
      >
        <SelectTrigger
          className={`w-fit space-x-2 border-0 ring-0 focus:ring-0 focus:ring-offset-0`}
          style={{ borderColor: context.color }}
        >
          <SelectValue placeholder="Выберите статус" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {/* <SelectLabel>Fruits</SelectLabel> */}
            {context.statusColumns?.map((column) => (
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
  );
}

function Rate() {
  const context = useContextRoot();
  return (
    <TableCell className="w-[1/6]">
      <RateItem
        symbol={context.symbol}
        rate={context.rate}
        payment_type={context.payment_type}
      />
    </TableCell>
  );
}

function DateItem() {
  const context = useContextRoot();
  const date = new Date(context.created_at).toLocaleString();
  return (
    <TableCell className="w-[1/6]">
      {context.created_at && <p>{date}</p>}
    </TableCell>
  );
}

function Users() {
  const context = useContextRoot();
  const { data: projectUsers } = useGetProjectSharedByIdQuery({
    project_id: context.project_id || "",
  });
  return (
    <TableCell className="w-[1/8]">
      <TaskSharedUsers
        taskMembers={context.task.taskMembers}
        projectMembers={projectUsers || []}
        taskId={""}
      />
    </TableCell>
  );
}

function Dropdown() {
  const navigate = useNavigate();
  const context = useContextRoot();
  const [deleteTask] = useDeleteTaskMutation();
  const [dialog, setDialog] = useState<dialogType>(null);

  function setDialogHandler(type: dialogType) {
    setDialog(type);
  }

  return (
    <TableCell className="w-[1/8]">
      <div className="flex justify-end pr-2">
        <Dialog
          open={dialog === "edit"}
          onOpenChange={(date) => setDialogHandler(date ? "edit" : null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Обновить задачу</DialogTitle>
            </DialogHeader>
            <UpdateTaskForm
              onSuccess={() => setDialogHandler(null)}
              onClose={() => setDialogHandler(null)}
              defaults={{
                name: context.name,
                description: context.description,
                is_paid: context.is_paid,
                payment_type: context.payment_type,
                rate: String(context.rate),
                currency_id: String(context.currency.currency_id || ""),
              }}
              taskId={context.task_id}
              currency={context.currency}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={dialog === "delete"}
          onOpenChange={(date) => setDialogHandler(date ? "delete" : null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
            </DialogHeader>
            <p>Вы уверены, что хотите удалить этот проект?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setDialogHandler(null)}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteTask(context.task_id);
                  setDialogHandler(null);
                }}
              >
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
                setDialogHandler("edit");
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
                onClick={() => navigate(`/tasks/${context.task_id}`)}
              >
                <ChartBar className="mr-2 size-4" />
                <span>Статистика</span>
              </DropdownMenuItem>
            </PrivateComponent>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDialogHandler("delete")}
            >
              <TrashIcon className="mr-2 size-4" />
              <span>Удалить</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableCell>
  );
}

const TaskCardTable = {
  Root: Root,
  Items: Items,
  Title: Title,
  Status: Status,
  Rate: Rate,
  Date: DateItem,
  Users: Users,
  DropdownMenu: Dropdown,
};

export default TaskCardTable;
