import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
import { AnimatePresence, motion } from "framer-motion";
import KanbanTask from "./KanbanTask";

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
      className={`w-72 shrink-0 flex flex-col gap-2 p-4 rounded-lg border transition-colors
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
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: column.color || "#ccc" }}
        />
        <h3 className="font-semibold">{column.name}</h3>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <KanbanTask
              key={task.task_id}
              task={task}
              index={index}
              onDragStart={onDragStart}
              onDragOver={handleDragOver}
              onDragEnd={onDragEnd}
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
          onDragOver={(e) => handleDragOver(e, tasks.length)}
        />
      </div>
    </motion.div>
  );
}
