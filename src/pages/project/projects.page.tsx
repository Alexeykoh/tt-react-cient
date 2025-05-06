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
import CreateProjectForm from "@/features/project/forms/create-project.form";
import { PanelTop } from "lucide-react";
import React, { useState } from "react";
import { formatDate } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import UserAvatar from "@/components/user-avatar";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import { useGetUserQuery } from "@/shared/api/user.service";
import { Badge } from "@/components/ui/badge";
import ProjectInvitationDialog from "@/features/project/project-invitation/project-invitation.dialog";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: userMe } = useGetUserQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch: refetchProjects } = useGetProjectsQuery({
    page: currentPage,
  });
  const [dialogIsOpen, setDialogIsOpen] = useState<
    "create" | "invitations" | null
  >(null);

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Проекты</h1>
          <ProjectInvitationDialog
            dialogIsOpen={dialogIsOpen === "invitations"}
            setDialogIsOpen={(_el) =>
              setDialogIsOpen(_el ? "invitations" : null)
            }
            refetchProjects={() => refetchProjects()}
          />
        </div>
        <Dialog
          open={dialogIsOpen === "create"}
          onOpenChange={(_el) => setDialogIsOpen(_el ? "create" : null)}
        >
          <DialogTrigger asChild>
            <Button size={"sm"}>Добавить проект</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новый проект</DialogTitle>
            </DialogHeader>
            <CreateProjectForm
              onSuccess={() => setDialogIsOpen(null)}
              onClose={() => setDialogIsOpen(null)}
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
                <TableHead className="w-1/6">Наименование</TableHead>
                <TableHead className="w-1/6">Пользователи</TableHead>
                <TableHead className="w-1/6">Клиент</TableHead>
                <TableHead className="w-1/6">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="flex-1">
              {data?.data &&
                data?.data.map((el) => {
                  const owner = el.members.find(
                    (_el) => _el.role === PROJECT_ROLE.OWNER
                  );
                  return (
                    <TableRow key={el.project_id}>
                      <TableCell className="font-medium w-1/6 flex items-center">
                        <Button
                          variant="ghost"
                          className="mr-2"
                          onClick={() =>
                            navigate(
                              `/${ROUTES.PROJECTS}/${TASKS_VIEW.TABLE}/${el.project_id}`
                            )
                          }
                        >
                          <span className="sr-only">Перейти к проекту</span>
                          <PanelTop />
                        </Button>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <p> {el?.name}</p>
                            <p>
                              <span className="text-xs text-gray-400">
                                Владелец:{" "}
                              </span>
                              {userMe?.user_id === owner?.user.user_id ? (
                                <Badge>Вы</Badge>
                              ) : (
                                owner?.user.name
                              )}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-2">
                          {el.members.slice(0, 5).map((_el) => (
                            <UserAvatar
                              key={_el.user.user_id}
                              size="xs"
                              name={_el?.user.name || ""}
                              planId={_el?.user?.subscriptions[0]?.planId}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="w-1/6">
                        {el?.client?.name}
                      </TableCell>
                      <TableCell className="w-1/6">
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
