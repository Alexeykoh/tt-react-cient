import { useSortable } from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/shared/interfaces/task.interface";

interface SortableTaskProps {
  task: Task;
  overId?: string | null;
  activeTaskId?: string | null;
}

export function SortableTask({ task, overId, activeTaskId }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.task_id,
    data: {
      type: "task",
      task,
      columnId: task.taskStatus.taskStatusColumn.id,
    },
  });

  // Подсветка drop-зоны под карточкой
  const isDropTarget = overId === task.task_id && !!activeTaskId;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
    boxShadow: isDropTarget ? "0 0 0 3px #50b4ff" : undefined,
    borderBottom: isDropTarget ? "2px solid #50b4ff" : undefined,
    borderRadius: isDropTarget ? "8px" : undefined,
    background: isDropTarget ? "rgba(80,180,255,0.10)" : undefined,
    zIndex: isDropTarget ? 2 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}
