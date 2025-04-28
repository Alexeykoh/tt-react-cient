// features/tasks/task-card.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Task } from "@/shared/interfaces/task.interface";
import TaskItem from "@/components/task-item";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card
      className={"border-0 shadow-2xl"}
      onClickCapture={() => {
        console.log("keke");
      }}
      key={task.task_id}
    >
      <CardHeader className="pb-2">
        <div className="flex  items-start justify-between">
          <CardTitle className="text-base font-semibold truncate break-words text-wrap">
            {task.name}
          </CardTitle>
          <TaskItem task_id={task.task_id} showTime={false} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
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
