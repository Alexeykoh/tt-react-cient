import React from "react";
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
import { motion } from "framer-motion";

interface KanbanItemProps {
  id: string;
  task: Task;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function KanbanItem({
  id,
  task,
  isDragging,
  onDragStart,
  onDragEnd,
}: KanbanItemProps) {
  // Форматируем информацию об оплате задачи
  const { data: projectUsers } = useGetProjectSharedByIdQuery({
    project_id: task?.project_id || "",
  });

  const navigate = useNavigate();

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Чтобы drag работал даже при клике на вложенные элементы
        e.stopPropagation();
        onDragStart();
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
      style={{
        border: "1px solid",
        borderColor: isDragging ? "var(--primary)" : "transparent",
        opacity: isDragging ? 0.1 : 1,
        borderRadius: "12px",
        cursor: "grab",
        background: "none",
        userSelect: "none",
      }}
      className="active:cursor-grabbing group p-0"
    >
      <motion.div layout>
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
    </div>
  );
}
