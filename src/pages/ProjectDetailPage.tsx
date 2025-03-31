import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/shared/api/projects.service";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/dateUtils";
import { useGetTasksByProjectQuery } from "@/shared/api/task.service";

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
    <div className="container mx-auto p-4">
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
    </div>
  );
};

export default ProjectDetailPage;
