import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./kanban-column";
import {
  TaskStatusColumn,
  PAYMENT,
  Task,
} from "@/shared/interfaces/task.interface";
import KanbanItem from "./kanban-item";
import { useUpdateTaskStatusMutation } from "@/shared/api/task.service";

interface porps {
  tasks: Task[];
  columns: TaskStatusColumn[];
}

export default function KanbanBoard({
  tasks: tasks_1,
  columns: columns_1,
}: porps) {
const [updateTaskStatus] = useUpdateTaskStatusMutation()


  const [columns, setColumns] = useState<TaskStatusColumn[]>(columns_1 ?? []);
  const [tasks, setTasks] = useState<Task[]>(tasks_1 ?? []);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Настраиваем сенсоры для drag-and-drop (перетаскивания)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Минимальное расстояние для активации перетаскивания
      },
    })
  );

  // Группируем задачи по колонкам
  const getTasksByColumn = (columnId: string) => {
    return [...tasks]
      ?.filter((task) => task.taskStatus.taskStatusColumn.id === columnId)
      ?.sort((a, b) => a.order - b.order);
  };

  // Обработчик начала перетаскивания задачи
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Находим задачу, которую начали перетаскивать
    const foundTask = tasks.find((task) => task.task_id === activeId);
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  // Обработчик перемещения задачи во время drag-and-drop
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Находим задачу, которую перетаскиваем
    const activeTask = tasks.find((task) => task.task_id === activeId);
    if (!activeTask) return;

    // Проверяем, перетаскиваем ли мы на колонку или на другую задачу
    const isOverColumn = columns.some((col) => col.id === overId);

    if (isOverColumn) {
      // Перетаскиваем на колонку
      if (activeTask.taskStatus.taskStatusColumn.id !== overId) {
        // Перемещаем задачу в другую колонку
        const updatedTasks = tasks.map((task) => {
          if (task.task_id === activeId) {
            // Находим максимальный order в целевой колонке
            const tasksInTargetColumn = getTasksByColumn(overId);
            const highestOrder =
              tasksInTargetColumn.length > 0
                ? Math.max(...tasksInTargetColumn.map((t) => t.order)) + 1
                : 0;

            return {
              ...task,
              taskStatus: {
                ...task.taskStatus,
                taskStatusColumn: {
                  ...columns.find((col) => col.id === overId)!,
                },
              },
              order: highestOrder,
            };
          }
          return task;
        });

        setTasks(updatedTasks as Task[]);
      }
    } else {
      // Перетаскиваем на другую задачу
      const overTask = tasks.find((task) => task.task_id === overId);
      if (!overTask) return;

      // Если задачи в разных колонках
      if (
        activeTask.taskStatus.taskStatusColumn.id !==
        overTask.taskStatus.taskStatusColumn.id
      ) {
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

          // Корректируем порядок других задач в целевой колонке
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
      }
    }
  };

  // Обработчик окончания перетаскивания задачи
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Находим задачу, которую перетаскивали
    const activeTask = tasks.find((task) => task.task_id === activeId);
    if (!activeTask) return;

    // Проверяем, перетаскиваем ли мы на задачу (для сортировки внутри одной колонки)
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

          // Обновляем порядок задач в колонке
          const updatedTasks = tasks.map((task) => {
            const newIndex = newOrder.indexOf(task.task_id);
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
      }
    }
  };

  // Добавить новую задачу в колонку
  // Можно расширить: добавить валидацию, уведомления и т.д.
  const handleAddTask = (columnId: string, taskName: string) => {
    if (taskName.trim() === "") return;

    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    const tasksInColumn = getTasksByColumn(columnId);
    const highestOrder =
      tasksInColumn.length > 0
        ? Math.max(...tasksInColumn.map((t) => t.order)) + 1
        : 0;

    const newTask: Task = {
      task_id: `task-${Date.now()}`,
      name: taskName,
      description: "",
      is_paid: false,
      payment_type: PAYMENT.FIXED,
      project_id: "",
      rate: 0,
      created_at: new Date().toISOString(),
      currency: {
        symbol: "$",
        name: "United States Dollar",
        code: "USD",
        currency_id: "1",
      },
      order: highestOrder,
      project: {
        project_id: "",
        name: "",
      },
      taskStatus: {
        id: `status-${Date.now()}`,
        taskStatusColumn: {
          id: columnId,
          name: column.name,
          color: column.color || "",
        },
      },
      taskMembers: [],
    };

    setTasks([...tasks, newTask]);
  };

  // Удалить колонку и все задачи в ней
  const handleDeleteColumn = (columnId: string) => {
    // Удаляем колонку
    setColumns(columns.filter((column) => column.id !== columnId));

    // Удаляем все задачи из этой колонки
    setTasks(
      tasks.filter((task) => task.taskStatus.taskStatusColumn.id !== columnId)
    );
  };

  // Удалить задачу
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.task_id !== taskId));
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...columns]
            ?.sort((a, b) => a.order - b.order)
            .map((column) => {
              const columnTasks = getTasksByColumn(column.id);
              return (
                <SortableContext
                  key={column.id}
                  items={columnTasks.map((task) => task.task_id)}
                >
                  <KanbanColumn
                    id={column.id}
                    title={column.name}
                    color={column.color}
                    tasks={columnTasks}
                    onAddTask={(name) => handleAddTask(column.id, name)}
                    onDeleteTask={handleDeleteTask}
                    onDeleteColumn={() => handleDeleteColumn(column.id)}
                  />
                </SortableContext>
              );
            })}
        </div>

        {/* Оверлей при перетаскивании задачи для визуальной обратной связи */}
        <DragOverlay>
          {activeTask && (
            <div className="opacity-80">
              <KanbanItem
                id={activeTask.task_id}
                task={activeTask}
                onDelete={() => handleDeleteTask(activeTask.task_id)}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
