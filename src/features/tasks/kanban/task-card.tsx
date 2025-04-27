// features/tasks/task-card.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/shared/interfaces/task.interface";

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold truncate">{task.name}</CardTitle>
          <Badge variant="outline" className="ml-2" style={{ backgroundColor: task.taskStatus.taskStatusColumn.color || undefined }}>
            {task.taskStatus.taskStatusColumn.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {task.description || "Нет описания"}
        </CardDescription>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Ставка: {task.rate} {task.currency?.symbol || ""}</span>
          <span>{new Date(task.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
