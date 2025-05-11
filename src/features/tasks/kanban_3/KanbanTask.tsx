import { ROUTES } from "@/app/router/routes.enum";
import TaskItem from "@/components/task-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { useGetProjectSharedByIdQuery } from "@/shared/api/projects-shared.service";
import { Task } from "@/shared/interfaces/task.interface";
import { motion } from "framer-motion";
import { CalendarDays, PanelTop } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskSharedUsers from "../shared-users/task-shared-users";

export default function KanbanTask({
  task,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  isDragged,
  showPlaceholder,
}: {
  task: Task;
  index: number;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent, position: number) => void;
  onDrop: () => void;
  isDragged: boolean;
  showPlaceholder: boolean;
}) {
  const navigate = useNavigate();
  const { data: projectUsers } = useGetProjectSharedByIdQuery({
      project_id: task?.project_id || "",
    });

  return (
    <>
      <motion.div
        layout
        draggable
        transition={{ duration: 0.1 }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isDragged ? 0.5 : 1,
          scale: isDragged ? 0.95 : 1,
        }}
        exit={{ opacity: 0 }}
        className={`relative cursor-grab active:cursor-grabbing ${
          isDragged ? "shadow-lg" : "hover:shadow"
        }`}
        onDragStart={() => onDragStart(task)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={onDrop}
      >
        {showPlaceholder && (
          <motion.div
            transition={{ duration: 0 }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 3 }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-primary rounded-full absolute top-[-6px]"
          />
        )}
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
                  tabIndex={-1}
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
      </motion.div>
    </>
  );
}
