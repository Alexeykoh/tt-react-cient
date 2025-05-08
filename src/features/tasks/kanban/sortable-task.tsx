import { useSortable } from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/shared/interfaces/task.interface";

interface SortableTaskProps {
  task: Task;
  overId?: string | null;
  activeTaskId?: string | null;
}

export function SortableTask({
  task,
  overId,
  activeTaskId,
}: SortableTaskProps) {
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
    background: isDropTarget ? "rgba(80,180,255,0.10)" : undefined,
    zIndex: isDropTarget ? 2 : undefined,
  };

  if (isDragging) {
    // Не рендерим карточку в списке, если она сейчас перетаскивается (DragOverlay покажет фантом)
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      className={`${isDropTarget && " border-1 border-primary rounded-lg"}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} />
    </div>
  );
}
