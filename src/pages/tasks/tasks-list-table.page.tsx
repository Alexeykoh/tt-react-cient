import {
  useGetTasksByProjectQuery,
  useGetTaskStatusColumnQuery,
} from "@/shared/api/task.service";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskTableRowFeature from "@/features/tasks/view-mod/task-table-row.feature";

export function TasksListTablePage() {
  const { id } = useParams<{ id: string }>();
  const { data: tasks } = useGetTasksByProjectQuery(id || "", {
    skip: !id,
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const { data: columns = [] } = useGetTaskStatusColumnQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="flex p-4">
      <Table className="flex-1 w-full ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[1/6]"></TableHead>
            <TableHead className="w-[1/6]">Наименование</TableHead>
            <TableHead className="w-[1/6]">Статус</TableHead>
            <TableHead className="w-[1/6]">Ставка</TableHead>
            <TableHead className="w-[1/6]">Дата</TableHead>
            <TableHead className="w-[1/6]">Пользователи</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex-1">
          {tasks &&
            tasks?.map((el) => {
              return (
                <TableRow key={el.task_id}>
                  <TaskTableRowFeature task={el} statusColumns={columns} />
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
