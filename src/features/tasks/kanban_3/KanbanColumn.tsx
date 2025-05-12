import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
import { AnimatePresence, motion } from "framer-motion";
import KanbanTask from "./KanbanTask";
import { Badge } from "@/components/ui/badge";
import { convertToRgba } from "@/lib/convert-to-rgba";

export default function KanbanColumn({
  column,
  tasks,
  draggedTask,
  hoverState,
  onDragStart,
  setHoverState,
  onDragEnd,
}: {
  column: TaskStatusColumn;
  tasks: Task[];
  draggedTask: Task | null;
  hoverState: { columnId: string | null; position: number | null };
  onDragStart: (task: Task) => void;
  setHoverState: (state: {
    columnId: string | null;
    position: number | null;
  }) => void;
  onDragEnd: (columnId?: string, position?: number) => void;
}) {
  const backgroundColor = column.color
    ? convertToRgba(column.color, "0.04")
    : "";
  const handleDragOver = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    setHoverState({
      columnId: column.id,
      position,
    });
  };

  return (
    <motion.div
      layout
      style={{ backgroundColor }}
      className={`min-w-72 max-w-72 h-full flex flex-col rounded-lg border transition-colors
        ${draggedTask && hoverState.columnId === column.id ? "border-primary/50 bg-accent/20" : "border-border"}`}
      onDragLeave={() => setHoverState({ columnId: null, position: null })}
      onDrop={(e) => {
        e.preventDefault();
        // Передаём columnId и position напрямую, чтобы не зависеть от setState
        onDragEnd(column.id, hoverState.position ?? tasks.length);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (tasks.length === 0) {
          setHoverState({ columnId: column.id, position: 0 });
        }
      }}
    >
      <div className="flex justify-between items-center h-fit p-4">
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <Badge
            style={{ backgroundColor: column.color || "" }}
            className="font-medium text-gray-800"
          >
            {column.name}
          </Badge>
        </div>
        <span className="text-sm text-gray-500">{tasks?.length || 0}</span>
      </div>

      <div className="flex flex-col h-full gap-2 overflow-y-auto py-2 px-4">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <KanbanTask
              key={task.task_id}
              task={task}
              index={index}
              onDragStart={onDragStart}
              onDragOver={handleDragOver}
              onDrop={() => onDragEnd(column.id, index)}
              isDragged={draggedTask?.task_id === task.task_id}
              showPlaceholder={
                hoverState.position === index &&
                hoverState.columnId === column.id
              }
            />
          ))}
        </AnimatePresence>

        {/* Placeholder для вставки в конец колонки */}
        <div
          className={`h-1 rounded-full transition-colors ${
            hoverState.position === tasks.length &&
            hoverState.columnId === column.id
              ? "bg-primary/50"
              : "bg-transparent"
          }`}
          style={{ minHeight: 4 }}
          onDragOver={(e) => handleDragOver(e, tasks.length)}
          onDragEnter={(e) => handleDragOver(e, tasks.length)}
        />
      </div>
    </motion.div>
  );
}
