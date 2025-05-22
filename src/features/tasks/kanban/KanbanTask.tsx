import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { useGetProjectSharedByIdQuery } from "@/shared/api/projects-shared.service";
import { Task } from "@/shared/interfaces/task.interface";
import { motion } from "framer-motion";
import { CalendarDays, PanelTop } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskSharedUsers from "../shared-users/task-shared-users";
import { useRef } from "react";
import TimeLogsTimer from "@/features/time-logs/time-logs-timer";

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

  // --- TOUCH DND LOGIC ---
  const touchDragging = useRef(false);

  // Автоскролл для touch
  const handleTouchAutoScroll = (clientY: number) => {
    // Ищем ближайший scrollable родитель (overflow-y-auto)
    let el = (event?.target as HTMLElement)?.parentElement;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      if (style.overflowY === "auto" || style.overflowY === "scroll") break;
      el = el.parentElement;
    }
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const threshold = 40;
    const scrollSpeed = 16;
    if (clientY - rect.top < threshold) {
      el.scrollBy({ top: -scrollSpeed, behavior: "auto" });
    } else if (rect.bottom - clientY < threshold) {
      el.scrollBy({ top: scrollSpeed, behavior: "auto" });
    }
  };

  // Touch события
  const handleTouchStart = () => {
    touchDragging.current = true;
    onDragStart(task);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragging.current) return;
    const touch = e.touches[0];
    // Эмулируем dragOver
    onDragOver(
      {
        ...e,
        preventDefault: () => {},
        clientY: touch.clientY,
        nativeEvent: e.nativeEvent,
      } as unknown as React.DragEvent,
      index
    );
    handleTouchAutoScroll(touch.clientY);
  };

  const handleTouchEnd = () => {
    if (!touchDragging.current) return;
    touchDragging.current = false;
    onDrop();
  };

  return (
    <>
      <motion.div
        layout
        layoutId={`kanban-task-${task.task_id}`}
        transition={{
          duration: 0,
        }}
        draggable
        initial={{ opacity: 0 }}
        animate={{
          opacity: isDragged ? 0.5 : 1,
        }}
        exit={{ opacity: 0 }}
        className={`relative cursor-grab active:cursor-grabbing ${
          isDragged ? "shadow-lg" : "hover:shadow"
        }`}
        onDragStart={() => onDragStart(task)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={onDrop}
        // TOUCH EVENTS
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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

        <Card className="border-0 p-0 w-full min-h-32">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-between w-full space-x-1">
                <TimeLogsTimer.Root task_id={task.task_id} variant="icon" showTime  />
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
              </div>
            </div>
              <CardTitle className="text-base font-semibold truncate break-words text-wrap">
                {task.name}
              </CardTitle>
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
