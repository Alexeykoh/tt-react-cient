import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
import KanbanColumn from "./KanbanColumn";
import {
  useUpdateTasksOrderMutation,
  useUpdateTaskStatusMutation,
} from "@/shared/api/task.service";

interface props {
  initialColumns: TaskStatusColumn[];
  initialTasks: Task[];
}

export function KanbanBoard({ initialColumns, initialTasks }: props) {
  const [columns, setColumns] = useState<TaskStatusColumn[]>(
    initialColumns || []
  );
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [hoverState, setHoverState] = useState<{
    columnId: string | null;
    position: number | null;
  }>({ columnId: null, position: null });

  const [updateTasksOrder] = useUpdateTasksOrderMutation();
  const [updateStatus] = useUpdateTaskStatusMutation();

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

    // Удаляем задачу из старого места
    const newTasks = tasks.filter((t) => t.task_id !== draggedTask.task_id);

    // Гарантируем, что targetColumnId — string
    const safeTargetColumnId = targetColumnId!;

    // Обновляем статус задачи
    const updatedTask = {
      ...draggedTask,
      taskStatus: {
        ...draggedTask.taskStatus,
        taskStatusColumn: {
          ...draggedTask.taskStatus.taskStatusColumn,
          id: safeTargetColumnId,
        },
      },
    };

    // Вставляем в новую позицию
    newTasks.splice(targetPosition ?? 0, 0, updatedTask);

    // Пересчитываем order только для задач в целевой колонке
    const targetTasks = newTasks
      .filter((t) => t.taskStatus.taskStatusColumn.id === safeTargetColumnId)
      .map((t, idx) => ({ ...t, order: idx }));

    // Остальные задачи
    const otherTasks = newTasks.filter(
      (t) => t.taskStatus.taskStatusColumn.id !== safeTargetColumnId
    );

    // Новый массив задач для локального стейта
    const newState = [...otherTasks, ...targetTasks];

    // Оптимистичное обновление UI
    setTasks(newState);

    // Только задачи целевой колонки для обновления порядка на сервере
    const tasksForUpdate = targetTasks.map((t) => ({
      task_id: t.task_id,
      order: t.order,
    }));

    // Асинхронно обновляем порядок на сервере
    updateTasksOrder({
      project_id: draggedTask.project_id || '',
      column_id: safeTargetColumnId,
      task_orders: tasksForUpdate,
    });

    // обновлять только если статус задачи изменился
    if (
      draggedTask.taskStatus.taskStatusColumn.id &&
      safeTargetColumnId &&
      draggedTask.taskStatus.taskStatusColumn.id !== safeTargetColumnId
    ) {
      updateStatus({
        task_id: updatedTask.task_id,
        task_status_column_id: safeTargetColumnId as string,
        projectId: draggedTask.project_id || '',
      });
    }

    setDraggedTask(null);
    setHoverState({ columnId: null, position: null });
  };

  return (
    <div className="flex gap-4  overflow-x-auto">
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
