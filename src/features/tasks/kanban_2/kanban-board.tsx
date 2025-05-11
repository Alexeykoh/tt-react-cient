import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./kanban-column";
import { TaskStatusColumn, Task } from "@/shared/interfaces/task.interface";
import KanbanItem from "./kanban-item";
import {
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from "@/shared/api/task.service";

interface porps {
  tasks: Task[];
  columns: TaskStatusColumn[];
}

export default function KanbanBoard({
  tasks: tasks_1,
  columns: columns_1,
}: porps) {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTask] = useUpdateTaskMutation();

  const [columns, setColumns] = useState<TaskStatusColumn[]>(columns_1);
  const [tasks, setTasks] = useState<Task[]>(tasks_1);
  const [displayTasks, setDisplayTasks] = useState<Task[]>(tasks);

  // Синхронизация локального состояния с props
  useEffect(() => {
    setColumns(columns_1 ?? []);
  }, [columns_1]);
  useEffect(() => {
    setTasks(tasks_1 ?? []);
  }, [tasks_1]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // id колонки, над которой сейчас drag-over
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByColumn = (columnId: string) => {
    return [...tasks]
      ?.filter((task) => task.taskStatus.taskStatusColumn.id === columnId)
      ?.sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;
    const foundTask = tasks.find((task) => task.task_id === activeId);
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

const handleDragOver = (event: DragOverEvent) => {
  const { active, over } = event;
  if (!active || !over) {
    setOverColumnId(null);
    setDisplayTasks(tasks);
    return;
  }

  const activeId = active.id as string;
  const overId = over.id as string;

  const activeTask = tasks.find((task) => task.task_id === activeId);
  if (!activeTask) return;

  // Если перетаскиваем на задачу
  const overTask = tasks.find((task) => task.task_id === overId);

  if (overTask) {
    // Целевая колонка
    const targetColumnId = overTask.taskStatus.taskStatusColumn.id;
    // Массив задач в целевой колонке
    const columnTasks = getTasksByColumn(targetColumnId).map(t => t.task_id);
    const activeIndex = columnTasks.indexOf(activeId);
    const overIndex = columnTasks.indexOf(overId);

    let newOrder = columnTasks;
    if (activeIndex === -1) {
      // Перетаскиваем из другой колонки
      newOrder = [...columnTasks];
      newOrder.splice(overIndex, 0, activeId);
    } else {
      // Внутри одной колонки
      newOrder = arrayMove(columnTasks, activeIndex, overIndex);
    }

    // Собираем новый массив задач для отображения
    const updatedTasks = tasks.map(task => {
      if (task.task_id === activeId) {
        // Временно меняем колонку
        return {
          ...task,
          taskStatus: {
            ...task.taskStatus,
            taskStatusColumn: {
              ...overTask.taskStatus.taskStatusColumn,
            },
          },
        };
      }
      return task;
    }).map(task => {
      // Обновляем временный order для задач в целевой колонке
      const idx = newOrder.indexOf(task.task_id);
      if (task.taskStatus.taskStatusColumn.id === targetColumnId && idx !== -1) {
        return { ...task, order: idx };
      }
      return task;
    });

    setDisplayTasks(updatedTasks);
    setOverColumnId(targetColumnId);
  } else {
    // Если перетаскиваем на колонку
    const column = columns.find(col => col.id === overId);
    if (column) {
      setOverColumnId(column.id);
      // Можно добавить задачу в конец
      const tasksInTarget = getTasksByColumn(column.id).map(t => t.task_id);
      const newOrder = [...tasksInTarget, activeId];
      const updatedTasks = tasks.map(task => {
        if (task.task_id === activeId) {
          return {
            ...task,
            taskStatus: {
              ...task.taskStatus,
              taskStatusColumn: { ...column },
            },
            order: newOrder.length - 1,
          };
        }
        return task;
      });
      setDisplayTasks(updatedTasks as Task[]);
    }
  }
};



  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    setOverColumnId(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTask = tasks.find((task) => task.task_id === activeId);

    if (!activeTask) {
      return;
    }

    const isOverTask = tasks.some((task) => task.task_id === overId);

    if (isOverTask && activeId !== overId) {
      const overTask = tasks.find((task) => task.task_id === overId)!;

      // Если задачи в одной колонке, меняем их порядок
      if (
        activeTask.taskStatus.taskStatusColumn.id ===
        overTask.taskStatus.taskStatusColumn.id
      ) {
        const columnTasks = getTasksByColumn(
          activeTask.taskStatus.taskStatusColumn.id
        ).map((task) => task.task_id);

        const activeIndex = columnTasks.indexOf(activeId);
        const overIndex = columnTasks.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newOrder = arrayMove(columnTasks, activeIndex, overIndex);

          const updatedTasks = tasks.map((task) => {
            const newIndex = newOrder.indexOf(task.task_id);
            updateTask({
              taskId: task.task_id,
              updateData: { order: newIndex },
            });
            if (
              newIndex !== -1 &&
              task.taskStatus.taskStatusColumn.id ===
                activeTask.taskStatus.taskStatusColumn.id
            ) {
              return {
                ...task,
                order: newIndex,
              };
            }
            return task;
          });

          setTasks(updatedTasks);
        }
      } else {
        // === Перемещение задачи в другую колонку через задачу ===
        const column = columns.find(
          (col) => col.id === overTask.taskStatus.taskStatusColumn.id
        );
        if (column) {
          const updatedTasks = tasks.map((task) => {
            if (task.task_id === activeId) {
              return {
                ...task,
                taskStatus: {
                  ...task.taskStatus,
                  taskStatusColumn: {
                    ...overTask.taskStatus.taskStatusColumn,
                  },
                },
                order: overTask.order,
              };
            }
            if (
              task.taskStatus.taskStatusColumn.id ===
                overTask.taskStatus.taskStatusColumn.id &&
              task.order >= overTask.order
            ) {
              return {
                ...task,
                order: task.order + 1,
              };
            }
            return task;
          });
          setTasks(updatedTasks);

          const updateDto = {
            task_id: activeTask.task_id,
            task_status_column_id: column.id,
          };
          updateTaskStatus(updateDto);
        }
      }
    } else {
      // Если перетаскиваем на саму колонку
      const column = columns.find((col) => col.id === overId);
      if (!column) {
        console.log(
          "Дроп не на колонку: overId не является id колонки, updateTaskStatus не вызывается"
        );
      } else if (activeTask.taskStatus.taskStatusColumn.id !== column.id) {
        const tasksInTargetColumn = getTasksByColumn(column.id);
        const highestOrder =
          tasksInTargetColumn.length > 0
            ? Math.max(...tasksInTargetColumn.map((t) => t.order)) + 1
            : 0;

        const updatedTasks = tasks.map((task) => {
          if (task.task_id === activeId) {
            return {
              ...task,
              taskStatus: {
                ...task.taskStatus,
                taskStatusColumn: {
                  ...column,
                  color: column.color || "",
                },
              },
              order: highestOrder,
            };
          }
          return task;
        });
        setTasks(updatedTasks);

        const updateDto = {
          task_id: activeTask.task_id,
          task_status_column_id: column.id,
        };
        updateTaskStatus(updateDto);
      }
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
    setTasks(
      tasks.filter((task) => task.taskStatus.taskStatusColumn.id !== columnId)
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.task_id !== taskId));
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        onDragStart={(e) => {
          console.log("onDragStart DndContext", e);
          handleDragStart(e);
        }}
        onDragOver={(e) => {
          console.log("onDragOver DndContext", e);
          handleDragOver(e);
        }}
        onDragEnd={(e) => {
          console.log("onDragEnd DndContext", e);
          handleDragEnd(e);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...columns]
            ?.sort((a, b) => a.order - b.order)
            .map((column) => {
              const columnTasks = getTasksByColumn(column.id);
              // определяем, подсвечивать ли колонку (если drag-over над ней или над ее задачей)
              const isOver =
                overColumnId === column.id ||
                columnTasks.some((task) => overColumnId === task.task_id);
              return (
                <SortableContext
                  key={column.id}
                  items={columnTasks.map((task) => ({
                    id: task.task_id.toString(),
                  }))}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    id={column.id}
                    title={column.name}
                    color={column.color}
                    tasks={columnTasks}
                    onAddTask={() => {}}
                    onDeleteTask={handleDeleteTask}
                    onDeleteColumn={() => handleDeleteColumn(column.id)}
                    isOver={isOver}
                    isDragging={!!activeTask}
                  />
                </SortableContext>
              );
            })}
        </div>
        <DragOverlay>
          {activeTask && (
            <KanbanItem id={activeTask.task_id} task={activeTask} />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
