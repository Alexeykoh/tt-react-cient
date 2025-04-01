import { Card, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/shared/api/projects.service";
import { Project } from "@/shared/interfaces/project.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateProjectForm from "@/features/project/CreateProjectForm";
import EditProjectForm from "@/features/project/EditProjectForm";
import {
  MoreVerticalIcon,
  PanelTop,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import React, { useState } from "react";
import { formatDate } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetProjectsQuery({ page: currentPage });
  const [deleteProject] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
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

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <Table className="flex-1 w-full">
            <TableHeader>
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
                    <TableRow className="cursor-pointer" key={el.project_id}>
                      <TableCell className="font-medium w-[30%] flex items-center">
                        <Button
                          variant="ghost"
                          className="mr-2"
                          onClick={() => navigate(`/projects/${el.project_id}`)}
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
                      <TableCell className="w-[15%] p-0 text-right">
                        <div className="flex justify-end pr-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted ml-auto"
                                size="icon"
                              >
                                <MoreVerticalIcon />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => {
                                  setProjectToEdit(el);
                                  setEditDialogIsOpen(true);
                                }}
                              >
                                <PencilIcon className="mr-2 size-4" />
                                <span>Редактировать</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  setProjectToDelete(el.project_id)
                                }
                              >
                                <TrashIcon className="mr-2 size-4" />
                                <span>Удалить</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
        </CardContent>
      </Card>

      {projectToDelete && (
        <Dialog open={true} onOpenChange={() => setProjectToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
            </DialogHeader>
            <p>Вы уверены, что хотите удалить этот проект?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setProjectToDelete(null)}
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteProject(projectToDelete);
                  setProjectToDelete(null);
                }}
              >
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {projectToEdit && (
        <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать проект</DialogTitle>
            </DialogHeader>
            <EditProjectForm
              projectId={projectToEdit.project_id}
              initialData={{
                name: projectToEdit.name,
                currency_id: projectToEdit.currency.code,
                rate: parseFloat(projectToEdit.rate),
                client_id: projectToEdit.client.client_id,
                tag_ids: [],
              }}
              onSuccess={() => setEditDialogIsOpen(false)}
              onClose={() => setEditDialogIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectsPage;
