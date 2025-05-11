import React from "react";
import { Card } from "@/components/ui/card";
import KanbanItem from "./kanban-item";
import { Task } from "@/shared/interfaces/task.interface";
import { convertToRgba } from "@/lib/convert-to-rgba";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string | null;
  tasks: Task[];
  isOver: boolean;
  isDragging: boolean;
  // Новые пропсы для drag-and-drop
  onDragStart: (taskId: string) => void;
  onDragOverColumn: (columnId: string) => void;
  onDragOverTask: (columnId: string, taskId: string) => void;
  onDrop: (columnId: string, beforeTaskId: string | null) => void;
  onDragEnd: () => void;
  draggedTaskId: string | null;
  dragOverTaskId: string | null;
}

export default function KanbanColumn({
  id,
  title,
  color,
  tasks,
  isOver,
  isDragging,
  onDragStart,
  onDragOverColumn,
  onDragOverTask,
  onDrop,
  onDragEnd,
  draggedTaskId,
  dragOverTaskId,
}: KanbanColumnProps) {
  // Цвет фона колонки
  const backgroundColor = color ? convertToRgba(color, "0.04") : "";

  // Подсветка рамки: если isOver — яркая рамка, если isDragging — полупрозрачная
  const borderClass = isOver
    ? "border-2 border-primary/50"
    : isDragging
      ? "border-2 border-primary/20"
      : "border-2 border-transparent";

  // Обработчик drop на колонку (в конец)
  const handleDropColumn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(id, null);
    onDragEnd();
  };

  // Обработчик drag over на колонку
  const handleDragOverColumn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragOverColumn(id);
  };

  // Обработчик drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragEnd();
  };

  return (
    <motion.div layout>
      <Card
        style={{ backgroundColor }}
        className={`shrink-0 h-full w-72 rounded-lg p-2 overflow-y-hidden transition-all duration-150 ${borderClass}`}
      >
        {/* Заголовок колонки и счетчик задач */}
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
        {/* Список задач в колонке */}
        <div
          className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full"
          onDrop={handleDropColumn}
          onDragOver={handleDragOverColumn}
          onDragLeave={handleDragLeave}
        >
          {/* Drop-зона в начале колонки */}
          <div
            style={{
              height: "24px",
              background:
                dragOverTaskId === "__start__" && isOver
                  ? "rgba(139,92,246,0.5)"
                  : "transparent",
              transition: "background 0.2s",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              console.log("onDragOver (start of column)", { columnId: id });
              onDragOverTask(id, "__start__");
            }}
            onDrop={(e) => {
              e.preventDefault();
              console.log("onDrop (start of column)", { columnId: id });
              // Если колонка не пуста, вставить перед первой задачей, иначе в конец
              if (tasks.length > 0) {
                onDrop(id, tasks[0].task_id);
              } else {
                onDrop(id, null);
              }
              onDragEnd();
            }}
          />
          {tasks.map((task) => (
            <React.Fragment key={task.task_id}>
              {/* Drop-зона перед задачей */}
              <div
                style={{
                  height: "24px",
                  background:
                    dragOverTaskId === task.task_id
                      ? "rgba(139,92,246,0.5)"
                      : "transparent",
                  transition: "background 0.2s",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  console.log("onDragOver (before task)", { columnId: id, beforeTaskId: task.task_id });
                  onDragOverTask(id, task.task_id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  console.log("onDrop (before task)", { columnId: id, beforeTaskId: task.task_id });
                  onDrop(id, task.task_id);
                  onDragEnd();
                }}
              />
              <KanbanItem
                id={task.task_id}
                task={task}
                isDragging={draggedTaskId === task.task_id}
                onDragStart={() => onDragStart(task.task_id)}
                onDragEnd={onDragEnd}
              />
            </React.Fragment>
          ))}
          {/* Drop-зона в конце колонки */}
          <div
            style={{
              height: "24px",
              background:
                dragOverTaskId === null && isOver
                  ? "rgba(139,92,246,0.5)"
                  : "transparent",
              transition: "background 0.2s",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              console.log("onDragOver (end of column)", { columnId: id });
              onDragOverColumn(id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              console.log("onDrop (end of column)", { columnId: id });
              onDrop(id, null);
              onDragEnd();
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
