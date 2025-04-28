import { Card } from "@/components/ui/card";
import { TaskStatusColumn } from "@/shared/interfaces/task.interface";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTask } from "./sortable-task";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { convertToRgba } from "@/lib/convert-to-rgba";
import { useMemo } from "react";

export function SortableColumn({ column }: { column: TaskStatusColumn }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
  });

  const backgroundColor = useMemo(() => {
    if (!column.color) return "";
    return convertToRgba(column.color, "0.04");
  }, [column.color]);

  return (
    <Card
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: column.color ? backgroundColor : "",
      }}
      className="shrink-0 h-full w-72 rounded-lg p-2 overflow-y-hidden"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-center h-fit">
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <Badge
            style={{ backgroundColor: column.color || "" }}
            className="font-medium"
          >
            {column.name}
          </Badge>
          <Button className="size-6" size={"icon"} variant={"outline"}>
            <Plus />
          </Button>
        </div>
        <span className="text-sm text-gray-500">
          {column.tasks?.length || 0}
        </span>
      </div>
      <SortableContext
        items={column.tasks?.map((t) => t.task_id) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 flex shrink-0 flex-col max-h-full ">
          {column.tasks?.map((task) => (
            <SortableTask key={task.task_id} task={task} />
          ))}
        </div>
      </SortableContext>
    </Card>
  );
}
