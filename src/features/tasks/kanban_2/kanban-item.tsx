import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/shared/interfaces/task.interface";
import { useGetProjectSharedByIdQuery } from "@/shared/api/projects-shared.service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes.enum";
import { CalendarDays, PanelTop } from "lucide-react";
import TaskItem from "@/components/task-item";
import TaskSharedUsers from "../shared-users/task-shared-users";

interface KanbanItemProps {
  id: string;
  task: Task;
}

export default function KanbanItem({ id, task }: KanbanItemProps) {
  // Настраиваем элемент для сортировки (drag-and-drop)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Применяем стили для перетаскивания задачи
  const style = {
    border: "1px solid",
    borderColor: isDragging ? "var(--primary)" : "transparent",
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.1 : 1,
    borderRadius: "12px",
    // zIndex: isDragging ? 1 : 0,
  };

  // Форматируем информацию об оплате задачи
  const { data: projectUsers } = useGetProjectSharedByIdQuery({
    project_id: task?.project_id || "",
  });

  const navigate = useNavigate();

  // Анимация и подсветка рамки при перетаскивании
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing group p-0`}
      {...attributes}
      {...listeners}
    >
      <Card className="border-0 p-0 w-full max-h-32 h-32 overflow-clip">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base font-semibold truncate break-words text-wrap">
              {task.name}
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                onClickCapture={() => {
                  navigate(`/${ROUTES.TASKS}/${task.task_id}`);
                }}
                size={"icon"}
                variant={"outline"}
                className="size-6"
              >
                <PanelTop className="size-3" />
              </Button>
              <TaskItem
                variant="icon"
                task_id={task.task_id}
                showTime={false}
              />
            </div>
          </div>
          <CardDescription className="py-2 line-clamp-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </CardDescription>
          <CardFooter className="px-0">
            <TaskSharedUsers
              taskMembers={task?.taskMembers}
              taskId={task.task_id}
              projectMembers={projectUsers || []}
            />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
