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
  closestCorners,
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
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetProjectByIdQuery } from "@/shared/api/projects.service";
import { useUpdateTaskStatusMutation } from "@/shared/api/task.service";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";
import { TaskCard } from "@/features/tasks/kanban/task-card";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<TaskStatusColumn[]>([]);
  const [updateStatus] = useUpdateTaskStatusMutation();

  const {
    data: initialColumns = [],
    isLoading: columnsLoading,
    error: columnsError,
  } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: project,
    error: projectError,
    isLoading: projectLoading,
  } = useGetProjectByIdQuery({ id: id! });

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
  });

  useEffect(() => {
    // Распределяем задачи по колонкам
    if (columns.length > 0 && tasks.length > 0) {
      setColumns((prevColumns) =>
        produce(prevColumns, (draft) => {
          draft.forEach((column) => {
            column.tasks = tasks.filter(
              (task) => task.taskStatus.taskStatusColumn.id === column.id
            );
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('DRAG END', { active, over, columns });
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
        overColumn = columns.find((col) => col.id === over.data.current?.columnId);
      } else {
        overColumn = columns.find((col) => col.id === over.id);
      }

      if (!activeColumn || !overColumn) return;

      // Оптимистичное обновление
      const newColumns = produce(columns, (draft) => {
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
            overIndex = targetCol.tasks?.findIndex((t) => t.task_id === over.id) ?? 0;
          } else {
            overIndex = targetCol.tasks?.length ?? 0;
          }
          targetCol.tasks?.splice(overIndex, 0, updatedTask);
        }
      });

      setColumns(newColumns);

      // Отправка на сервер
      await updateStatus({
        task_id: active.id.toString(),
        task_status_column_id: overColumn.id,
      }).unwrap();
    } catch (error) {
      console.error("Ошибка при переносе задачи:", error);
      setColumns(previousColumns);
    } finally {
      setActiveTask(null);
    }
  };

  if (projectLoading || columnsLoading) return <div>Загрузка...</div>;
  if (projectError || columnsError) return <div>Ошибка загрузки данных</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">Добавить задачу</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую задачу</DialogTitle>
            </DialogHeader>
            <CreateTaskForm
              onSuccess={() => setDialogIsOpen(false)}
              onClose={() => setDialogIsOpen(false)}
              projectId={project?.project_id || ""}
              projectRate={Number(project?.rate) || 0}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex overflow-x-auto gap-4 pb-4">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} className="shadow-xl w-72" />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Column({ column }: { column: TaskStatusColumn }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-72 rounded-lg p-4"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{column.name}</h3>
        <span className="text-sm text-gray-500">
          {column.tasks?.length || 0}
        </span>
      </div>
      <SortableContext
        items={column.tasks?.map((t) => t.task_id) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {column.tasks?.map((task) => (
            <SortableTask key={task.task_id} task={task} />
          ))}
        </div>
      </SortableContext>
    </Card>
  );
}

function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.task_id,
    data: {
      type: "task",
      task,
      columnId: task.taskStatus.taskStatusColumn.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} className="hover:shadow-md transition-shadow" />
    </div>
  );
}

// Добавить в существующие интерфейсы (если нельзя менять исходные, создаем локально):
declare module "@/shared/interfaces/task.interface" {
  interface TaskStatusColumn {
    tasks?: Task[];
  }
}
