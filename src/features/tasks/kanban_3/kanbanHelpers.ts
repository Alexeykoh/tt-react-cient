// utils/kanbanHelpers.ts

import { Task } from "@/shared/interfaces/task.interface";

/**
 * Вычисляет индекс вставки задачи по позиции курсора Y
 */
export function calculateNewOrder(columnElement: Element, clientY: number): number {
  const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
  if (taskElements.length === 0) return 0;

  for (let i = 0; i < taskElements.length; i++) {
    const rect = taskElements[i].getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;
    if (clientY < middleY) {
      return i;
    }
  }
  return taskElements.length;
}

/**
 * Обновляет порядок задач в состоянии после перемещения
 */
export function updateTaskOrderInState(
  tasks: Task[],
  taskId: string,
  newStatusId: string,
  newOrder: number
): Task[] {
  const taskToMove = tasks.find(t => t.task_id === taskId);
  if (!taskToMove) return tasks;

  // Удаляем таск из списка
  const filteredTasks = tasks.filter(t => t.task_id !== taskId);

  // Задачи в целевой колонке
  const targetTasks = filteredTasks
    .filter(t => t.taskStatus.taskStatusColumn.id === newStatusId)
    .sort((a, b) => a.order - b.order);

  // Вставляем таск в нужное место
  targetTasks.splice(newOrder, 0, {
    ...taskToMove,
    taskStatus: {
      ...taskToMove.taskStatus,
      taskStatusColumn: {
        ...taskToMove.taskStatus.taskStatusColumn,
        id: newStatusId,
      },
    },
  });

  // Обновляем order для всех задач в целевой колонке
  const updatedTargetTasks = targetTasks.map((t, i) => ({ ...t, order: i }));

  // Задачи в других колонках
  const otherTasks = filteredTasks.filter(t => t.taskStatus.taskStatusColumn.id !== newStatusId);

  return [...otherTasks, ...updatedTargetTasks];
}
