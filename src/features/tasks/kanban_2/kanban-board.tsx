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

interface porps {
  tasks: Task[];
  columns: TaskStatusColumn[];
}

export default function KanbanBoard({
  tasks: tasks_1,
  columns: columns_1,
}: porps) {
  const [columns, setColumns] = useState<TaskStatusColumn[]>(columns_1 ?? []);
  const [tasks, setTasks] = useState<Task[]>(tasks_1 ?? []);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by column
  const getTasksByColumn = (columnId: string) => {
    return [...tasks]
      ?.filter((task) => task.taskStatus.taskStatusColumn.id === columnId)
      ?.sort((a, b) => a.order - b.order);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Find the task being dragged
    const foundTask = tasks.find((task) => task.task_id === activeId);
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((task) => task.task_id === activeId);
    if (!activeTask) return;

    // Check if dragging over a column or a task
    const isOverColumn = columns.some((col) => col.id === overId);

    if (isOverColumn) {
      // Dragging over a column
      if (activeTask.taskStatus.taskStatusColumn.id !== overId) {
        // Move task to a different column
        const updatedTasks = tasks.map((task) => {
          if (task.task_id === activeId) {
            // Find the highest order in the target column
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
      // Dragging over another task
      const overTask = tasks.find((task) => task.task_id === overId);
      if (!overTask) return;

      // If tasks are in different columns
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

          // Adjust orders of other tasks in the target column
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

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((task) => task.task_id === activeId);
    if (!activeTask) return;

    // Check if dragging over a task (for reordering within the same column)
    const isOverTask = tasks.some((task) => task.task_id === overId);

    if (isOverTask && activeId !== overId) {
      const overTask = tasks.find((task) => task.task_id === overId)!;

      // If tasks are in the same column, reorder them
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

          // Update orders based on new positions
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

  // Add a new task to a column
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

  // Delete a column
  const handleDeleteColumn = (columnId: string) => {
    // Remove the column
    setColumns(columns.filter((column) => column.id !== columnId));

    // Remove all tasks in that column
    setTasks(
      tasks.filter((task) => task.taskStatus.taskStatusColumn.id !== columnId)
    );
  };

  // Delete a task
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

        {/* Drag overlay for visual feedback */}
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
