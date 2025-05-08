import { useGetTasksByProjectQuery, useGetTaskStatusColumnQuery } from "@/shared/api/task.service";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "@/features/tasks/kanban/task-card";
import { SortableColumn } from "@/features/tasks/kanban/sortable-column";
import type { DragStartEvent } from "@dnd-kit/core";
import KanbanBoard from "@/features/tasks/kanban_2/kanban-board";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Получаем колонки и задачи
  const { data: columns = [], isLoading, error } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
    pollingInterval: 5000,
    refetchOnFocus: true,
  });
  const { data: tasks = [] } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    pollingInterval: 5000,
  });

  // Мемоизированное распределение задач по колонкам
  const columnsWithTasks = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: tasks
        .filter((task) => task?.taskStatus?.taskStatusColumn?.id === column.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, [columns, tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Получаем активную задачу для DragOverlay
  const activeTask = useMemo(
    () => tasks.find((t) => t.task_id === activeTaskId) || null,
    [activeTaskId, tasks]
  );

  // DnD-обработчики
  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "task") {
      setActiveTaskId(event.active.data.current.task.task_id);
    }
  }

  function handleDragEnd() {
    setActiveTaskId(null);
    // Здесь должна быть логика обновления порядка и колонки задачи (можно вынести в отдельный хук)
    // Для простоты — не реализуем оптимистичный UI, только вызов мутаций
    // Можно добавить позже
  }

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <div className="space-y-4 flex w-full h-full p-4">
      <KanbanBoard/>
    </div>
  );
}
