import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import KanbanItem from "./kanban-item";
import { Task } from "@/shared/interfaces/task.interface";
import { convertToRgba } from "@/lib/convert-to-rgba";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string | null;
  tasks: Task[];
  onAddTask: (name: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: () => void;
}

export default function KanbanColumn({
  id,
  title,
  color,
  tasks,

  onDeleteTask,
}: KanbanColumnProps) {
  // Set up droppable area
  const { setNodeRef } = useDroppable({
    id,
  });

  const backgroundColor = useMemo(() => {
    if (!color) return "";
    return convertToRgba(color, "0.04");
  }, [color]);

  return (
    <Card
      style={{ backgroundColor }}
      className={`shrink-0 h-full w-72 rounded-lg p-2 overflow-y-hidden`}
    >
      <div className="flex justify-between items-center h-fit">
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <Badge
            style={{ backgroundColor: color || "" }}
            className="font-medium text-gray-800"
          >
            {title}
          </Badge>
        </div>
        <span className="text-sm text-gray-500">{tasks?.length || 0}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[200px]">
        <SortableContext items={tasks.map((task) => task.task_id)}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <KanbanItem
                key={task.task_id}
                id={task.task_id}
                task={task}
                onDelete={() => onDeleteTask(task.task_id)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </Card>
  );
}
