import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/shared/api/projects.service";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/dateUtils";
import { useGetTasksByProjectQuery } from "@/shared/api/task.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskItem from "@/components/task-item";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectByIdQuery({ id: id! });
  const { data: tasks } = useGetTasksByProjectQuery(id || "", { skip: !id });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки проекта</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">{project?.data?.name}</h1>
          <p>Клиент: {project?.data?.client?.name}</p>
          <p>
            Ставка: {project?.data?.currency?.symbol}
            {project?.data?.rate}
          </p>
          <p>Дата создания: {formatDate(project?.data?.created_at || "")}</p>
        </CardContent>
      </Card>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <Table className="flex-1 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Наименование</TableHead>
                <TableHead className="w-[20%]">Описание</TableHead>
                <TableHead className="w-[20%]">Тип оплаты</TableHead>
                <TableHead className="w-[15%]">Статус</TableHead>
                {/* <TableHead className="w-[15%]"></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody className="flex-1">
              {tasks &&
                tasks?.map((el) => {
                  return (
                    <TableRow key={el.task_id}>
                      <TableCell className="font-medium w-[30%] flex items-center">
                        <TaskItem task_id={el.task_id} />
                      </TableCell>
                      <TableCell className="w-[20%]">
                        {el?.description}
                      </TableCell>
                      <TableCell className="w-[20%]">
                        {el?.payment_type}
                      </TableCell>
                      <TableCell className="w-[15%]">
                        {el?.is_paid ? "Оплачен" : "Не оплачен"}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
