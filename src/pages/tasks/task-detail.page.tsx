import { Button } from "@/components/ui/button";
import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} from "@/shared/api/task.service";
import {
  CalendarDays,
  ChevronLeft,
  HandCoins,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
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
import { ROUTES, VIEW_ROUTES } from "@/app/router/routes.enum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { useGetTimeLogLogsQuery } from "@/shared/api/time-log.service";
import TaskItem from "@/components/task-item";

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

  const chartConfig = {
    duration: {
      label: "Duration",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

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
                    navigate(`/${ROUTES.PROJECTS}/${VIEW_ROUTES.TABLE}`);
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
                        showTime={false}
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

        <div className="flex-1 overflow-hidden p-4">
          <Card className="w-96 h-auto">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={timeLogs?.data?.map((el) => {
                  return { ...el, created_at: formatDate(el.created_at) };
                })}
              >
                <CartesianGrid vertical={false} />
                {/* <XAxis
                  dataKey="created_at"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return formatDate(value);
                  }}
                /> */}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="duration"
                  fill="var(--color-primary)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>
      </div>
    </>
  );
}
