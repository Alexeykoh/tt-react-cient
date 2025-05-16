import {
  useGetTasksByProjectQuery,
  useGetTaskStatusColumnQuery,
} from "@/shared/api/task.service";
import { useParams } from "react-router-dom";

// import KanbanBoard from "@/features/tasks/kanban_2/kanban-board";
import { KanbanBoard } from "@/features/tasks/kanban/KanbanBoard";
// import { Task, TaskStatusColumn } from "@/shared/interfaces/task.interface";
// import KanbanBoard_3 from "@/features/tasks/kanban_3/kanban-board";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();

  // Получаем колонки и задачи
  const {
    data: columns = [],
    isLoading: isColumnsLoading,
  } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    pollingInterval: 15000,
  });
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
  } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    pollingInterval: 15000,
  });

  const isLoading = isColumnsLoading || isTasksLoading;

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <span>Загрузка доски...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex w-full h-full p-4">
      <KanbanBoard
        initialColumns={columns}
        initialTasks={tasks}
      />
    </div>
  );
}
