import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetProjectsQuery } from "@/shared/api/projects.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateProjectForm from "@/features/project/CreateProjectForm";
import { PanelTop } from "lucide-react";
import React, { useState } from "react";
import { formatDate } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES, VIEW_ROUTES } from "@/app/router/routes.enum";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetProjectsQuery({ page: currentPage });
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-2xl font-bold mb-4">Проекты</h1>
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button>Добавить проект</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новый проект</DialogTitle>
            </DialogHeader>
            <CreateProjectForm
              onSuccess={() => setDialogIsOpen(false)}
              onClose={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <Table className="flex-1 w-full">
            <TableHeader>
              <TableHead></TableHead>
              <TableRow>
                <TableHead className="w-[30%]">Наименование</TableHead>
                <TableHead className="w-[20%]">Клиент</TableHead>
                <TableHead className="w-[20%]">Ставка / ч.</TableHead>
                <TableHead className="w-[15%]">Дата</TableHead>
                <TableHead className="w-[15%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="flex-1">
              {data?.data &&
                data?.data.map((el) => {
                  return (
                    <TableRow key={el.project_id}>
                      <TableCell className="font-medium w-[30%] flex items-center">
                        <Button
                          variant="default"
                          className="mr-2"
                          onClick={() =>
                            navigate(
                              `/${ROUTES.PROJECTS}/${VIEW_ROUTES.TABLE}/${el.project_id}`
                            )
                          }
                        >
                          <span className="sr-only">Перейти к проекту</span>
                          <PanelTop />
                        </Button>
                        {el?.name}
                      </TableCell>
                      <TableCell className="w-[20%]">
                        {el?.client?.name}
                      </TableCell>
                      <TableCell className="w-[20%]">{`${el?.currency?.symbol}${el?.rate}`}</TableCell>
                      <TableCell className="w-[15%]">
                        {formatDate(el?.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {data?.meta && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Страница {data.meta.page} из {data.meta.totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage <= 1}
                >
                  Назад
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, data.meta.totalPages)
                    )
                  }
                  disabled={currentPage >= data.meta.totalPages}
                >
                  Вперед
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
