import { Card } from "@/components/ui/card";
import { Task } from "@/shared/interfaces/task.interface";
import { motion } from "framer-motion";

export default function KanbanTask({
  task,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragged,
  showPlaceholder,
}: {
  task: Task;
  index: number;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent, position: number) => void;
  onDragEnd?: (columnId?: string, position?: number) => void;
  isDragged: boolean;
  showPlaceholder: boolean;
}) {
  return (
    <>
      {showPlaceholder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 4 }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full bg-primary rounded-full"
        />
      )}

      <motion.div
        layout
        draggable
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
        onDragEnd={() => onDragEnd?.()}
      >
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{task.name}</h4>
            {task.is_paid && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {task.payment_type}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {task.description}
          </p>
        </Card>
      </motion.div>
    </>
  );
}
