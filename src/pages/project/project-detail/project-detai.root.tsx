import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Suspense,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  CoinsIcon,
  Kanban,
  LogOut,
  MoreVerticalIcon,
  PencilIcon,
  Table,
  Timer,
  TrashIcon,
  User2Icon,
} from "lucide-react";
import {
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
} from "@/shared/api/projects.service";
import { useGetUserQuery } from "@/shared/api/user.service";
import InvitedUsers from "@/features/project/invited-users/invited-users";
import LeaveProjectDialog from "@/features/project/leave-project.dialog";
import EditProjectForm from "@/features/project/forms/edit-project.form";
import RoleComponent from "@/widgets/role-component";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import { useNavigate, useParams } from "react-router-dom";
import { TasksListBoardPage } from "@/pages/tasks/tasks-list-board.page";
import { TasksListTablePage } from "@/pages/tasks/tasks-list-table.page";
import { Separator } from "@radix-ui/react-separator";
import { User } from "@/shared/interfaces/user.interface";
import RoleBadge from "@/components/role-badge";
import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { formatMilliseconds } from "@/lib/format-seconds";

// Определяем тип значения контекста
interface context {
  userMe: User;
  id: string;
}

// Создаём контекст с типом, по умолчанию null
const TaskCardMainContext = createContext<context | null>(null);

interface props {
  children: ReactNode;
}

function Root({ children }: props) {
  console.log("TaskCardMainContext / root / re-render");
  const { data: userMe } = useGetUserQuery();
  const { id } = useParams<{ id: string }>();

  const contextProps: context = { userMe: userMe!, id: id! };
  return (
    <TaskCardMainContext.Provider value={contextProps}>
      <div className="w-full h-full flex flex-col">{children}</div>
    </TaskCardMainContext.Provider>
  );
}

function HeaderRoot({ children }: { children: ReactNode }) {
  console.log("HeaderRoot / re-render");
  return (
    <div className="w-full">
      <div className="flex justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full p-4 gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function HeaderTop() {
  return (
    <div className="flex items-center gap-4 border-b-2 py-2 justify-between w-full">
      <ProjectTitle />
      <div className="flex items-center gap-4">
        <UsersOnProject />
        <CreateTaskBtn />
      </div>
    </div>
  );
}

function ProjectTitle() {
  const context = useContext(TaskCardMainContext);
  const [deleteProject] = useDeleteProjectMutation();

  const [dialogIsOpen, setDialogIsOpen] = useState<
    "edit" | "delete" | "leave" | null
  >(null);
  const navigate = useNavigate();

  const project_id: string | undefined = context?.id;

  const { data: projectData } = useGetProjectByIdQuery({
    id: project_id || "",
  });

  const project = projectData?.project || null;

  return (
    <>
      <LeaveProjectDialog
        project_id={project?.project_id || ""}
        member_id={
          project?.members.find(
            (el) => el.user.user_id === context?.userMe?.user_id
          )?.member_id || ""
        }
        dialogIsOpen={dialogIsOpen === "leave"}
        setDialogIsOpen={(data) => setDialogIsOpen(data ? "leave" : null)}
        projectRefetch={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <Dialog
        open={dialogIsOpen === "edit"}
        onOpenChange={(data) => setDialogIsOpen(data ? "edit" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
          </DialogHeader>
          <EditProjectForm
            projectId={project?.project_id || ""}
            initialData={{
              name: project?.name || "",
              client_id: project?.client?.client_id,
              tag_ids: [],
            }}
            onSuccess={() => setDialogIsOpen(null)}
            onClose={() => setDialogIsOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogIsOpen === "delete"}
        onOpenChange={(data) => setDialogIsOpen(data ? "delete" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этот проект?</p>
          <p className="text-gray-400">
            Все приглашенные пользователи получат уведомление об удалении
            проекта.
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                navigate("/projects");
                setDialogIsOpen(null);
                await deleteProject(context?.id || "");
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4">
        <Button
          className="size-6"
          size={"icon"}
          variant={"outline"}
          onClick={() => navigate(`/${ROUTES.PROJECTS}`)}
        >
          <ChevronLeft />
        </Button>
        <div className="flex gap-4 text-xl font-bold items-center">
          <p className="uppercase">{project?.name}</p>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex size-6 text-muted-foreground data-[state=open]:bg-muted ml-auto"
                  size="icon"
                >
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <RoleComponent
                  roles={[PROJECT_ROLE.OWNER]}
                  userRole={
                    project?.members.find(
                      (m) => m.user?.user_id === context?.userMe?.user_id
                    )?.role as PROJECT_ROLE
                  }
                  showChildren={false}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setDialogIsOpen("edit");
                    }}
                  >
                    <PencilIcon className="mr-2 size-4" />
                    <span>Редактировать</span>
                  </DropdownMenuItem>
                </RoleComponent>

                <RoleComponent
                  roles={[PROJECT_ROLE.OWNER]}
                  userRole={
                    project?.members.find(
                      (m) => m.user?.user_id === context?.userMe?.user_id
                    )?.role as PROJECT_ROLE
                  }
                  showChildren={false}
                >
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDialogIsOpen("delete")}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    <span>Удалить</span>
                  </DropdownMenuItem>
                </RoleComponent>

                <RoleComponent
                  roles={[
                    PROJECT_ROLE.GUEST,
                    PROJECT_ROLE.EXECUTOR,
                    PROJECT_ROLE.MANAGER,
                  ]}
                  userRole={
                    project?.members.find(
                      (m) => m.user?.user_id === context?.userMe?.user_id
                    )?.role as PROJECT_ROLE
                  }
                  showChildren={false}
                >
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDialogIsOpen("leave")}
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Покинуть проект</span>
                  </DropdownMenuItem>
                </RoleComponent>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateTaskBtn() {
  const context = useContext(TaskCardMainContext);
  const project_id: string | undefined = context?.id;

  const { data: projectData } = useGetProjectByIdQuery({
    id: project_id || "",
  });

  const [dialogIsOpen, setDialogIsOpen] = useState<
    "create" | "edit" | "delete" | "invite" | "leave" | null
  >(null);

  const project = projectData?.project || null;

  return (
    <Dialog
      open={dialogIsOpen === "create"}
      onOpenChange={(data) => setDialogIsOpen(data ? "create" : null)}
    >
      <RoleComponent
        roles={[PROJECT_ROLE.OWNER, PROJECT_ROLE.MANAGER]}
        userRole={
          project?.members.find(
            (m) => m.user?.user_id === context?.userMe?.user_id
          )?.role as PROJECT_ROLE
        }
        showChildren={false}
      >
        <DialogTrigger asChild>
          <Button size={"sm"} className="w-fit">
            Добавить задачу
          </Button>
        </DialogTrigger>
      </RoleComponent>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую задачу</DialogTitle>
        </DialogHeader>
        <CreateTaskForm
          onSuccess={() => setDialogIsOpen(null)}
          onClose={() => setDialogIsOpen(null)}
          projectId={project_id || ""}
        />
      </DialogContent>
    </Dialog>
  );
}

function UsersOnProject() {
  const context = useContext(TaskCardMainContext);
  const project_id: string | undefined = context?.id;

  const { data: projectData } = useGetProjectByIdQuery({
    id: project_id || "",
  });

  const project = projectData?.project || null;

  return (
    <RoleComponent
      roles={[PROJECT_ROLE.OWNER, PROJECT_ROLE.MANAGER]}
      userRole={
        project?.members.find(
          (m) => m.user?.user_id === context?.userMe?.user_id
        )?.role as PROJECT_ROLE
      }
      showChildren={false}
    >
      <div className="flex flex-row gap-1">
        <InvitedUsers
          members={project?.members || []}
          project_id={project?.project_id || ""}
        />
      </div>
    </RoleComponent>
  );
}

function HeaderBottom() {
  const context = useContext(TaskCardMainContext);
  const project_id: string | undefined = context?.id;

  const { data: projectData } = useGetProjectByIdQuery({
    id: project_id || "",
  });

  const info = projectData?.info || null;
  const { hours, minutes, seconds } = formatMilliseconds(
    info?.projectDuration || 0
  );

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-1 items-center">
          <RoleBadge role={info?.myRole} />
        </div>
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <UserAvatar
            name={info?.owner?.user?.name || ""}
            planId={SUBSCRIPTION.FREE}
            size={"xs"}
          />
          <p className="text-sm text-muted-foreground">
            {info?.owner?.user?.name}
          </p>
        </div>
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <CoinsIcon className="size-3.5" />
          <p className="text-sm text-muted-foreground">
            {info?.myPaymentType} {"/"} {info?.myCurrency.symbol}
            {info?.myRate}
          </p>
        </div>
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <User2Icon className="size-3.5" />
          <p className="text-sm text-muted-foreground">{info?.client?.name}</p>
        </div>
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <Timer className="size-3.5" />
          <p className="text-sm text-muted-foreground">
            {hours}:{minutes}:{seconds}
          </p>
        </div>
      </div>
    </>
  );
}

function ViewSection() {
  const [view, setView] = useState<TASKS_VIEW>(TASKS_VIEW.BOARD);

  return (
    <>
      <div className="flex items-center gap-2 p-4">
        <Button
          onClick={() => setView(TASKS_VIEW.BOARD)}
          size={"sm"}
          variant={view === TASKS_VIEW.BOARD ? "outline" : "ghost"}
        >
          <Kanban />
          <span>Доска</span>
        </Button>
        <Button
          onClick={() => setView(TASKS_VIEW.TABLE)}
          size={"sm"}
          variant={view === TASKS_VIEW.TABLE ? "outline" : "ghost"}
        >
          <Table />
          <span>Таблица</span>
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Загрузка...</div>}>
          {view === TASKS_VIEW.BOARD && <TasksListBoardPage />}
          {view === TASKS_VIEW.TABLE && <TasksListTablePage />}
        </Suspense>
      </div>
    </>
  );
}

const Header = {
  Root: HeaderRoot,
  Top: HeaderTop,
  Bottom: HeaderBottom,
};

const ProjectDetail = {
  Root: Root,
  Header: Header,
  ViewSection: ViewSection,
};

export default ProjectDetail;
