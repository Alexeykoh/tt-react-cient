import { useGetTasksByProjectQuery } from "@/shared/api/task.service";
import { useParams } from "react-router-dom";
import TaskListItemFeature from "@/features/tasks/view-mod/task-list-item.feature";

export function TasksListListPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tasks } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="flex flex-wrap gap-4 h-full w-full overflow-y-auto p-4">
      {tasks &&
        tasks?.map((el) => {
          return <TaskListItemFeature {...el} />;
        })}
    </div>
  );
}
