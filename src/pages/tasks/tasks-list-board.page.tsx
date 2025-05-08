import {
  useGetTasksByProjectQuery,
  useGetTaskStatusColumnQuery,
} from "@/shared/api/task.service";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  pointerWithin,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSensors,
  useSensor,
  PointerSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { produce } from "immer";
import {
  useUpdateTaskStatusMutation,
  useUpdateTaskMutation,
} from "@/shared/api/task.service";
import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
import { TaskCard } from "@/features/tasks/kanban/task-card";
import { SortableColumn } from "@/features/tasks/kanban/sortable-column";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<TaskStatusColumn[]>([]);
  const [overId, setOverId] = useState<string | null>(null);
  const [updateStatus] = useUpdateTaskStatusMutation();
  const [updateTask] = useUpdateTaskMutation();

  const {
    data: initialColumns = [],
    isLoading: columnsLoading,
    error: columnsError,
  } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
    pollingInterval: 5000,
    refetchOnFocus: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor)
  );

  useEffect(() => {
    if (initialColumns.length > 0) {
      // Нормализуем данные для работы с DnD
      const normalizedColumns = initialColumns.map((column) => ({
        ...column,
        tasks: [], // Инициализируем пустые задачи
      }));

      setColumns(normalizedColumns);
    }
  }, [initialColumns]);

  // Предполагаем, что задачи приходят отдельно (нужно добавить запрос)
  const { data: tasks = [] } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    pollingInterval: 5000,
  });

  useEffect(() => {
    // Распределяем задачи по колонкам
    if (columns.length > 0 && tasks.length > 0) {
      setColumns((prevColumns) =>
        produce(prevColumns, (draft) => {
          draft.forEach((column) => {
            column.tasks = tasks
              .filter(
                (task) => task?.taskStatus?.taskStatusColumn?.id === column.id
              )
              .sort((a, b) => a.order - b.order);
          });
        })
      );
    }
  }, [tasks, columns.length]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id?.toString() || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setOverId(null);
    if (!over || active.id === over.id) return;

    const previousColumns = [...columns];

    try {
      // Находим исходную колонку
      const activeColumn = columns.find((col) =>
        col.tasks?.some((t) => t.task_id === active.id)
      );

      // Определяем целевую колонку:
      // если over.data.current?.columnId есть — это задача, иначе если over.id — это id колонки
      let overColumn: TaskStatusColumn | undefined;
      if (over.data.current?.columnId) {
        overColumn = columns.find(
          (col) => col.id === over.data.current?.columnId
        );
      } else {
        overColumn = columns.find((col) => col.id === over.id);
      }

      if (!activeColumn || !overColumn) return;

      // Оптимистичное обновление
      let newColumns = produce(columns, (draft) => {
        const sourceCol = draft.find((c) => c.id === activeColumn.id)!;
        const targetCol = draft.find((c) => c.id === overColumn.id)!;

        const taskIndex =
          sourceCol.tasks?.findIndex((t) => t.task_id === active.id) ?? -1;
        const [movedTask] = sourceCol.tasks?.splice(taskIndex, 1) || [];

        if (movedTask) {
          // Обновляем статус задачи локально
          const updatedTask = {
            ...movedTask,
            taskStatus: {
              ...movedTask.taskStatus,
              taskStatusColumn: {
                ...overColumn,
                color: overColumn.color ?? "", // заменяем null на пустую строку
              },
            },
          };

          // Если переносим на задачу — вставляем перед ней, иначе в конец
          let overIndex = 0;
          if (over.data.current?.type === "task") {
            overIndex =
              targetCol.tasks?.findIndex((t) => t.task_id === over.id) ?? 0;
          } else {
            overIndex = targetCol.tasks?.length ?? 0;
          }
          targetCol.tasks?.splice(overIndex, 0, updatedTask);
        }
      });

      // Пересчёт order для задач в обеих колонках
      newColumns = produce(newColumns, (draft) => {
        // Обновить order в целевой колонке
        const targetCol = draft.find((c) => c.id === overColumn.id);
        if (targetCol && targetCol.tasks) {
          targetCol.tasks.forEach((task, idx) => {
            task.order = idx;
          });
        }
        // Если перемещение между колонками — обновить order и в исходной колонке
        if (activeColumn.id !== overColumn.id) {
          const sourceCol = draft.find((c) => c.id === activeColumn.id);
          if (sourceCol && sourceCol.tasks) {
            sourceCol.tasks.forEach((task, idx) => {
              task.order = idx;
            });
          }
        }
      });

      setColumns(newColumns);

      // Отправка на сервер: обновить статус и порядок задачи
      await updateStatus({
        task_id: active.id.toString(),
        task_status_column_id: overColumn.id,
      }).unwrap();

      // Собрать все задачи из обеих колонок для синхронизации order
      const syncTasks: { taskId: string; updateData: { order: number } }[] = [];
      const targetCol = newColumns.find((c) => c.id === overColumn.id);
      if (targetCol && targetCol.tasks) {
        targetCol.tasks.forEach((task, idx) => {
          syncTasks.push({ taskId: task.task_id, updateData: { order: idx } });
        });
      }
      if (activeColumn.id !== overColumn.id) {
        const sourceCol = newColumns.find((c) => c.id === activeColumn.id);
        if (sourceCol && sourceCol.tasks) {
          sourceCol.tasks.forEach((task, idx) => {
            syncTasks.push({
              taskId: task.task_id,
              updateData: { order: idx },
            });
          });
        }
      }

      // Синхронизировать order на сервере для всех задач в обеих колонках
      await Promise.all(
        syncTasks.map(({ taskId, updateData }) =>
          updateTask({ taskId, updateData })
        )
      );
    } catch (error) {
      console.error("Ошибка при переносе задачи:", error);
      setColumns(previousColumns);
    } finally {
      setActiveTask(null);
    }
  };

  if (columnsLoading) return <div>Загрузка...</div>;
  if (columnsError) return <div>Ошибка загрузки данных</div>;

  return (
    <div className="space-y-4 flex w-full h-full p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex overflow-x-auto gap-4 pb-4 w-full h-full">
            {columns.map((column) => (
              <SortableColumn
                key={column.id}
                column={column}
                overId={overId}
                activeTaskId={activeTask?.task_id || null}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Добавить в существующие интерфейсы (если нельзя менять исходные, создаем локально):
declare module "@/shared/interfaces/task.interface" {
  interface TaskStatusColumn {
    tasks?: Task[];
  }
}
