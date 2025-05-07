// features/tasks/task-card.tsx
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Task } from "@/shared/interfaces/task.interface";
import TaskItem from "@/components/task-item";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@/components/ui/button";
import { CalendarDays, PanelTop } from "lucide-react";
import TaskSharedUsers from "../shared-users/task-shared-users";
import { useGetProjectSharedByIdQuery } from "@/shared/api/projects-shared.service";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { data: projectUsers } = useGetProjectSharedByIdQuery({
    project_id: task?.project_id || "",
  });

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
  );
}
