import {
  useGetTasksByProjectQuery,
  useGetTaskStatusColumnQuery,
} from "@/shared/api/task.service";
import { useParams } from "react-router-dom";

import KanbanBoard from "@/features/tasks/kanban_2/kanban-board";

export function TasksListBoardPage() {
  const { id } = useParams<{ id: string }>();

  // Получаем колонки и задачи
  const { data: columns = [] } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
    pollingInterval: 5000,
    refetchOnFocus: true,
  });
  const { data: tasks = [] } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    pollingInterval: 5000,
  });

  return (
    <div className="space-y-4 flex w-full h-full p-4">
      <KanbanBoard tasks={tasks} columns={columns} />
    </div>
  );
}
