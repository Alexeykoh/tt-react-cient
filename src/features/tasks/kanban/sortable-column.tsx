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

interface SortableColumnProps {
  column: TaskStatusColumn;
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
          {(column.tasks ?? []).map((task) => {
            // Вставляем фантом (placeholder) перед задачей, если overId совпадает с task_id
            const shouldShowPlaceholder =
              overId === task.task_id &&
              activeTaskId &&
              overId !== activeTaskId &&
              overId !== column.id;

            return (
              <React.Fragment key={task.task_id}>
                {shouldShowPlaceholder && (
                  <div
                    key={`${task.task_id}-placeholder`}
                    className="rounded-lg border-2 border-dashed border-primary bg-primary/10 animate-pulse"
                    style={{
                      height: 64,
                      marginBottom: 8,
                      transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                    }}
                  />
                )}
                <SortableTask
                  task={task}
                  overId={overId}
                  activeTaskId={activeTaskId}
                />
              </React.Fragment>
            );
          })}
          {/* Если перетаскиваем в пустую колонку или в конец */}
          {(column.tasks?.length ?? 0) === 0 &&
            overId === column.id &&
            activeTaskId &&
            overId !== activeTaskId && (
              <div
                className="rounded-lg border-2 border-dashed border-primary bg-primary/10 animate-pulse"
                style={{
                  height: 64,
                  marginBottom: 8,
                  transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                }}
              />
            )}
          {(column.tasks?.length ?? 0) > 0 &&
            overId &&
            !(column.tasks ?? []).some((t) => t.task_id === overId) &&
            overId === column.id &&
            activeTaskId &&
            overId !== activeTaskId && (
              <div
                className="rounded-lg border-2 border-dashed border-primary bg-primary/10 animate-pulse"
                style={{
                  height: 64,
                  marginBottom: 8,
                  transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                }}
              />
            )}
        </div>
      </SortableContext>
    </Card>
  );
}
