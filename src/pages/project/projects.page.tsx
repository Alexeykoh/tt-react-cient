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
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import UserAvatar from "@/components/user-avatar";
import { ProjectRole } from "@/shared/enums/project-role.enum";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import {
  useApproveProjectSharedInvationMutation,
  useDeleteRoleProjectSharedMutation,
  useGetProjectsSharedInvationsQuery,
} from "@/shared/api/projects-shared.service";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RoleBadge from "@/components/role-badge";
import { useGetUserQuery } from "@/shared/api/user.service";

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
  const { data: projectInvitations } = useGetProjectsSharedInvationsQuery();
  const [approveInvitation, { isLoading: isLoadingInvitation }] =
    useApproveProjectSharedInvationMutation();
  const [deleteInvitation, { isLoading: isLoadingDelete }] =
    useDeleteRoleProjectSharedMutation();

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Проекты</h1>
          {projectInvitations && projectInvitations?.length > 0 && (
            <Dialog
              open={dialogIsOpen === "invitations"}
              onOpenChange={(_el) =>
                setDialogIsOpen(_el ? "invitations" : null)
              }
            >
              <DialogTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full size-6"
                >
                  {projectInvitations?.length}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Приглашения на проект</DialogTitle>
                </DialogHeader>
                {projectInvitations.map((el) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex flex-col items-start flex-wrap gap-4">
                          <div className="flex justify-between w-full flex-wrap gap-4">
                            <div className="flex flex-col flex-wrap gap-1">
                              <h3 className="text-xs text-gray-400">{`Отправитель:`}</h3>
                              <div className="flex items-center flex-wrap gap-1">
                                <UserAvatar
                                  size="xs"
                                  name={el.project.user.name}
                                  planId={SUBSCRIPTION.FREE}
                                />
                                <span>{el.project.user.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col flex-wrap gap-1">
                              <h3 className="text-xs text-gray-400">{`Роль:`}</h3>
                              <div className="flex items-center flex-wrap gap-1">
                                <RoleBadge role={el.role} />
                              </div>
                            </div>
                            <div className="flex flex-col flex-wrap gap-1">
                              <h3 className="text-xs text-gray-400">{`Проект:`}</h3>
                              <div className="flex items-center flex-wrap gap-1">
                                <span>{el.project.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="self-end">
                      <div className="flex items-center gap-2">
                        <Button
                          size={"sm"}
                          variant={"ghost"}
                          isLoading={isLoadingDelete}
                          disabled={isLoadingDelete}
                          onClick={() => {
                            deleteInvitation({
                              project_id: el.project_id,
                              user_id: userMe?.user_id || "",
                            });
                            setDialogIsOpen(null);
                          }}
                        >
                          Отклонить
                        </Button>
                        <Button
                          size={"sm"}
                          variant={"secondary"}
                          isLoading={isLoadingInvitation}
                          disabled={isLoadingInvitation}
                          onClick={() => {
                            approveInvitation({ project_id: el.project_id })
                              .unwrap()
                              .then(() =>
                                refetchProjects()
                              );
                            setDialogIsOpen(null);
                          }}
                        >
                          Принять
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </DialogContent>
            </Dialog>
          )}
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
                <TableHead className="w-1/6">Владелец</TableHead>
                <TableHead className="w-1/6">Клиент</TableHead>
                <TableHead className="w-1/6">Ставка / ч.</TableHead>
                <TableHead className="w-1/6">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="flex-1">
              {data?.data &&
                data?.data.map((el) => {
                  const owner = el?.members?.find(
                    (el) => el.role === ProjectRole.OWNER
                  )?.user;

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
                        {el?.name}
                      </TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            size="xs"
                            name={owner?.name || ""}
                            planId={
                              owner?.subscriptions[0].planId ||
                              SUBSCRIPTION.FREE
                            }
                          />
                          {owner?.name}
                        </div>
                      </TableCell>
                      <TableCell className="w-1/6">
                        {el?.client?.name}
                      </TableCell>
                      <TableCell className="w-1/6">{`${el?.currency?.symbol}${el?.rate}`}</TableCell>
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
