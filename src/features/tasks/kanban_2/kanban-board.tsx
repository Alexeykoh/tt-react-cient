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
import { motion, AnimatePresence } from "framer-motion";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./kanban-column";
import {
  TaskStatusColumn,
  PAYMENT,
  Task,
} from "@/shared/interfaces/task.interface";
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
    // Определяем, над какой колонкой сейчас drag-over
    const { over } = event;
    if (over) {
      setOverColumnId(over.id as string);
    } else {
      setOverColumnId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    setOverColumnId(null);

    const { active, over } = event;
    console.log("handleDragEnd вызван", { event, active, over });
    if (!over) {
      console.log("over отсутствует");
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTask = tasks.find((task) => task.task_id === activeId);
    console.log(
      "activeId:",
      activeId,
      "overId:",
      overId,
      "activeTask:",
      activeTask
    );
    if (!activeTask) {
      console.log("activeTask не найден");
      return;
    }

    const isOverTask = tasks.some((task) => task.task_id === overId);
    console.log("isOverTask:", isOverTask);

    if (isOverTask && activeId !== overId) {
      const overTask = tasks.find((task) => task.task_id === overId)!;
      console.log("overTask:", overTask);

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

        console.log(
          "columnTasks:",
          columnTasks,
          "activeIndex:",
          activeIndex,
          "overIndex:",
          overIndex
        );

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

          console.log(
            `Задача реально перемещена в новую колонку (через задачу), id новой колонки: ${column.id}`
          );
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

        console.log(
          `Задача реально перемещена в новую колонку (через колонку), id новой колонки: ${column.id}`
        );
        const updateDto = {
          task_id: activeTask.task_id,
          task_status_column_id: column.id,
        };
        updateTaskStatus(updateDto);
      }
    }
  };

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

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
    setTasks(
      tasks.filter((task) => task.taskStatus.taskStatusColumn.id !== columnId)
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.task_id !== taskId));
  };

  console.log("KanbanBoard рендерится");
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
                    isOver={isOver}
                    isDragging={!!activeTask}
                  />
                </SortableContext>
              );
            })}
        </div>
        <DragOverlay>
          <AnimatePresence>
            {activeTask && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0.7, boxShadow: "0 0 0 0 var(--primary)" }}
                animate={{
                  scale: 1.05,
                  opacity: 1,
                  boxShadow: "0 8px 8px 0 var(--primary)",
                  transition: { type: "spring", stiffness: 300, damping: 25 },
                }}
                exit={{ scale: 0.95, opacity: 0.7, boxShadow: "0 0 0 0 var(--primary)" }}
                style={{ borderRadius: 12, zIndex: 1000 }}
              >
                <div className=""></div>
                <KanbanItem
                  id={activeTask.task_id}
                  task={activeTask}
                  onDelete={() => handleDeleteTask(activeTask.task_id)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DragOverlay>
      </DndContext>
    </div>
  );
}
