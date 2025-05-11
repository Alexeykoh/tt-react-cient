import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
import KanbanColumn from "./KanbanColumn";

interface props {
  initialColumns: TaskStatusColumn[];
  initialTasks: Task[];
}

export function KanbanBoard_3({ initialColumns, initialTasks }: props) {
  const [columns, setColumns] = useState<TaskStatusColumn[]>(
    initialColumns || []
  );
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [hoverState, setHoverState] = useState<{
    columnId: string | null;
    position: number | null;
  }>({ columnId: null, position: null });

  // Загрузка данных (пример)
  useEffect(() => {
    if (initialColumns && initialTasks) {
      setTasks(initialTasks);
      setColumns(initialColumns);
    }
    // Здесь должна быть логика загрузки данных
  }, [initialColumns, initialTasks]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = (columnId?: string, position?: number) => {
    // Если не было дропа в колонку — просто сбросить состояние
    const targetColumnId = columnId ?? hoverState.columnId;
    const targetPosition = position ?? hoverState.position;

    if (!draggedTask || !targetColumnId) {
      setDraggedTask(null);
      setHoverState({ columnId: null, position: null });
      return;
    }

    const newTasks = tasks.filter((t) => t.task_id !== draggedTask.task_id);

    // Обновляем статус задачи
    const updatedTask = {
      ...draggedTask,
      taskStatus: {
        ...draggedTask.taskStatus,
        taskStatusColumn: {
          ...draggedTask.taskStatus.taskStatusColumn,
          id: targetColumnId,
        },
      },
    };
    console.log("targetColumnId", targetColumnId);

    // Вставляем в новую позицию
    newTasks.splice(targetPosition ?? 0, 0, updatedTask);

    // Пересчитываем order для задач в целевой колонке
    const targetTasks = newTasks
      .filter((t) => t.taskStatus.taskStatusColumn.id === targetColumnId)
      .map((t, idx) => ({ ...t, order: idx }));

    // Остальные задачи
    const otherTasks = newTasks.filter(
      (t) => t.taskStatus.taskStatusColumn.id !== targetColumnId
    );

    setTasks([...otherTasks, ...targetTasks]);

    setDraggedTask(null);
    setHoverState({ columnId: null, position: null });
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      <AnimatePresence>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks
              .filter((t) => t.taskStatus.taskStatusColumn.id === column.id)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))}
            draggedTask={draggedTask}
            hoverState={hoverState}
            onDragStart={handleDragStart}
            setHoverState={setHoverState}
            onDragEnd={handleDragEnd}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
