import { useSortable } from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/shared/interfaces/task.interface";

export function SortableTask({ task }: { task: Task }) {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} className="hover:shadow-md transition-shadow" />
    </div>
  );
}
