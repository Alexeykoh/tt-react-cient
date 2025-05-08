import React from "react";
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
import { convertToRgba } from "@/lib/convert-to-rgba";
import { useMemo } from "react";

interface TaskWithTasks extends TaskStatusColumn {
  tasks?: import("@/shared/interfaces/task.interface").Task[];
}

interface SortableColumnProps {
  column: TaskWithTasks;
  overId: string | null;
  activeTaskId: string | null;
}

export function SortableColumn({
  column,
  overId,
  activeTaskId,
}: SortableColumnProps) {
  const { setNodeRef, attributes, isDragging, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: "column", column },
    });

  const backgroundColor = useMemo(() => {
    if (!column.color) return "";
    return convertToRgba(column.color, "0.04");
  }, [column.color]);

  // Подсветка колонки как drop-зоны, если на неё перетаскивают задачу
  const isDropColumnActive = overId === column.id && !!activeTaskId;

  return (
    <Card
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isDropColumnActive
          ? "rgba(80,180,255,0.15)"
          : column.color
            ? backgroundColor
            : "",
      }}
      className={`shrink-0 h-full w-72 rounded-lg p-2 overflow-y-hidden ${isDropColumnActive && "border-1 border-primary"}`}
      {...attributes}
      // {...listeners}
    >
      <div className="flex justify-between items-center h-fit">
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <Badge
            style={{ backgroundColor: column.color || "" }}
            className="font-medium text-gray-800"
          >
            {column.name}
          </Badge>
        </div>
        <span className="text-sm text-gray-500">
          {column.tasks?.length || 0}
        </span>
      </div>
      <SortableContext
        items={column.tasks?.map((t) => t.task_id) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 flex-1 flex-col overflow-y-auto">
          {(column.tasks ?? []).map((task: import("@/shared/interfaces/task.interface").Task) => (
            <SortableTask
              key={task.task_id}
              task={task}
              overId={overId}
              activeTaskId={activeTaskId}
            />
          ))}
        </div>
      </SortableContext>
    </Card>
  );
}
