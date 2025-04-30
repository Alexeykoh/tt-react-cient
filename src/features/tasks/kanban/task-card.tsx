// features/tasks/task-card.tsx
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Task } from "@/shared/interfaces/task.interface";
import TaskItem from "@/components/task-item";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@/components/ui/button";
import { PanelTop } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  return (
    <Card className={"border-0 shadow-2xl p-0"} key={task.task_id}>
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
            <TaskItem variant="icon" task_id={task.task_id} showTime={false} />
          </div>
        </div>
        <CardDescription className="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {task.description || "Нет описания"}
        </CardDescription>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Ставка: {task.rate} {task.currency?.symbol || ""}
          </span>
          <span>{new Date(task.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
