// hooks/useKanbanDnD.tsx
import { useState } from 'react';
import { calculateNewOrder } from './kanbanHelpers';

export function useKanbanDnD(
  updateTaskOrder: (taskId: string, newStatusId: string, newOrder: number) => void
) {
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  // Начало перетаскивания
  function handleDragStart(taskId: string) {
    setDraggingTaskId(taskId);
  }

  // Во время перемещения (drag over)
  function handleDragOver(columnId: string) {
    setActiveColumn(columnId);
  }

  // Окончание перетаскивания
  function handleDragEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingTaskId) return;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const targetColumn = elements.find(el => el.hasAttribute('data-column-id'));

    if (!targetColumn) {
      setActiveColumn(null);
      setDraggingTaskId(null);
      return;
    }

    const newStatusId = targetColumn.getAttribute('data-column-id')!;
    const newOrder = calculateNewOrder(targetColumn, e.clientY);

    updateTaskOrder(draggingTaskId, newStatusId, newOrder);

    setActiveColumn(null);
    setDraggingTaskId(null);
  }

  return {
    activeColumn,
    draggingTaskId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
