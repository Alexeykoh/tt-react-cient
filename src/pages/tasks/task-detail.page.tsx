import { Button } from "@/components/ui/button";
import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} from "@/shared/api/task.service";
import {
  Calculator,
  Calendar,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  HandCoins,
  MoreVerticalIcon,
  PencilIcon,
  Settings,
  Smile,
  TrashIcon,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/lib/dateUtils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateTaskForm from "@/features/tasks/forms/update-task.form";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useGetTimeLogLogsQuery } from "@/shared/api/time-log.service";
import TaskItem from "@/components/task-item";
import { GanttChart } from "@/shared/ui/gantt-chart";
import { GanttTask } from "@/shared/types/gantt.types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteTask] = useDeleteTaskMutation();
  const { data: task } = useGetTaskByIdQuery(id || "", { skip: !id });
  const { data: timeLogs } = useGetTimeLogLogsQuery(
    { task_id: id || "" },
    { skip: !id }
  );

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      {task && (
        <>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Редактировать задачу</DialogTitle>
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
            open={taskToDelete !== null}
            onOpenChange={() => setTaskToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
              </DialogHeader>
              <p>Вы уверены, что хотите удалить эту задачу?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setTaskToDelete(null)}>
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    navigate(`/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}`);
                    await deleteTask(id || "");
                    setTaskToDelete(null);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
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
                      onClick={() => navigate(-1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <div className="flex gap-4 text-xl font-bold items-center">
                      <TaskItem
                        task_id={task?.task_id || ""}
                        showTime={true}
                        variant={"icon"}
                      />
                      <Separator
                        orientation="vertical"
                        className="border-1 min-h-5"
                      />
                      <p className="uppercase">{task?.name}</p>
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
                              onClick={() => setTaskToDelete(id || "")}
                            >
                              <TrashIcon className="mr-2 size-4" />
                              <span>Удалить</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap text-gray-400 text-xs h-5">
                    <div className="flex items-center gap-2">
                      <HandCoins className="w-4 h-4" />
                      <p>
                        {task?.currency?.symbol}
                        {task?.rate}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="border-1" />
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <p>{formatDate(task?.created_at || "")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-hidden p-4 w-full h-full gap-4">
          <div className="flex w-full">
            <Card className="w-full h-96 p-4">
              <h3 className="text-lg font-semibold mb-2">Диаграмма Ганта</h3>
              <GanttChart
                tasks={
                  (timeLogs?.data?.map((log) => ({
                    id: log.log_id,
                    label: (
                      <div className="text-xs flex gap-1 items-center">
                        {log.duration}
                      </div>
                    ),
                    start: log.start_time,
                    end: log.end_time,
                  })) as GanttTask[]) || []
                }
                height={32}
                className="w-full h-64"
              />
            </Card>
          </div>
          <Command className="rounded-lg border shadow-md w-64 h-full">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Calendar />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <Smile />
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem disabled>
                  <Calculator />
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </>
  );
}
