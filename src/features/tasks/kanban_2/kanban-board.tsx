import React, { useState, useEffect } from "react";
import KanbanColumn from "./kanban-column";
import { TaskStatusColumn, Task } from "@/shared/interfaces/task.interface";
import { motion } from "framer-motion";

interface KanbanBoardProps {
  tasks: Task[];
  columns: TaskStatusColumn[];
}

export function KanbanBoard({
  tasks: initialTasks,
  columns: initialColumns,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<TaskStatusColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Синхронизация локального состояния с props
  useEffect(() => {
    setColumns(initialColumns ?? []);
  }, [initialColumns]);
  useEffect(() => {
    setTasks(initialTasks ?? []);
  }, [initialTasks]);

  // drag state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  // Получить задачи по колонке
  const getTasksByColumn = (columnId: string) => {
    return [...tasks]
      .filter((task) => task.taskStatus.taskStatusColumn.id === columnId)
      .sort((a, b) => a.order - b.order);
  };

  // Drag & Drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOverColumn = (columnId: string) => {
    setDragOverColumnId(columnId);
    setDragOverTaskId(null);
  };

  const handleDragOverTask = (columnId: string, taskId: string) => {
    setDragOverColumnId(columnId);
    setDragOverTaskId(taskId);
  };

  const handleDrop = (columnId: string, beforeTaskId: string | null) => {
    if (!draggedTaskId) return;

    const draggedTask = tasks.find((t) => t.task_id === draggedTaskId);
    if (!draggedTask) return;

    // Если задача уже в этой колонке и не меняет позицию — ничего не делаем
    if (
      draggedTask.taskStatus.taskStatusColumn.id === columnId &&
      (beforeTaskId === null ||
        getTasksByColumn(columnId).findIndex((t) => t.task_id === draggedTaskId) ===
          getTasksByColumn(columnId).findIndex((t) => t.task_id === beforeTaskId) - 1)
    ) {
      setDraggedTaskId(null);
      setDragOverColumnId(null);
      setDragOverTaskId(null);
      return;
    }

    // Удаляем задачу из старой колонки
    let updatedTasks = tasks.filter((t) => t.task_id !== draggedTaskId);

    // Получаем задачи целевой колонки
    const columnTasks = getTasksByColumn(columnId);

    // Определяем индекс вставки
    let insertIndex = columnTasks.length;
    if (beforeTaskId) {
      insertIndex = columnTasks.findIndex((t) => t.task_id === beforeTaskId);
      if (insertIndex === -1) insertIndex = columnTasks.length;
    }

    // Обновляем задачу
    const foundColumn = columns.find((col) => col.id === columnId);
    const newTask: Task = {
      ...draggedTask,
      taskStatus: {
        ...draggedTask.taskStatus,
        taskStatusColumn: {
          id: foundColumn?.id ?? columnId,
          name: foundColumn?.name ?? "",
          color: foundColumn?.color ?? "",
        },
      },
      order: insertIndex,
    };

    // Вставляем задачу в нужное место
    const newColumnTasks = [
      ...columnTasks.slice(0, insertIndex),
      newTask,
      ...columnTasks.slice(insertIndex),
    ].map((t, idx) => ({
      ...t,
      order: idx,
    }));

    // Обновляем все задачи
    updatedTasks = [
      ...updatedTasks.filter(
        (t) => t.taskStatus.taskStatusColumn.id !== columnId
      ),
      ...newColumnTasks,
    ];

    setTasks(updatedTasks);
    setDraggedTaskId(null);
    setDragOverColumnId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumnId(null);
    setDragOverTaskId(null);
  };


  return (
    <div className="space-y-4">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        layout
      >
        {[...columns]
          .sort((a, b) => a.order - b.order)
          .map((column) => {
            const columnTasks = getTasksByColumn(column.id);
            const isOver =
              dragOverColumnId === column.id ||
              columnTasks.some((task) => dragOverTaskId === task.task_id);

            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.name}
                color={column.color}
                tasks={columnTasks}
                isOver={isOver}
                isDragging={!!draggedTaskId}
                onDragStart={handleDragStart}
                onDragOverColumn={handleDragOverColumn}
                onDragOverTask={handleDragOverTask}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTaskId={draggedTaskId}
                dragOverTaskId={dragOverTaskId}
              />
            );
          })}
      </motion.div>
    </div>
  );
}

export default KanbanBoard;
