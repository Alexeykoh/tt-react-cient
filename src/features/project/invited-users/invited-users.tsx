import { ProjectMembers } from "@/shared/interfaces/project.interface";
import UserAvatar from "@/components/user-avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import RoleComponent from "@/widgets/role-component";
import { ProjectRole } from "@/shared/enums/project-role.enum";

interface InvitedUsersProps {
  members: Array<ProjectMembers>;
  userRole: ProjectRole;
  // Опционально: функции для изменения роли и удаления пользователя
  onRoleChange?: (userId: string, newRole: ProjectRole) => void;
  onRemove?: (userId: string) => void;
}

export default function InvitedUsers({
  members,
  userRole,
  onRoleChange,
  onRemove,
}: InvitedUsersProps) {
  return (
    <>
      {members?.map((el) => (
        <Dialog key={el.user?.user_id}>
          <DialogTrigger asChild>
            <div className="relative">
              <Button
                size={"icon"}
                variant={"ghost"}
                className={`${!el.approve && "grayscale-[100%]"} rounded-full`}
              >
                <UserAvatar
                  size="small"
                  name={el.user?.name || ""}
                  planId={el.user?.subscriptions[0]?.planId || ""}
                />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Информация о пользователе</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-0.5">
                <h3 className="text-xs font-light text-gray-400">
                  Пользователь
                </h3>
                <p>{el.user?.name}</p>
              </div>
              <RoleComponent
                roles={[ProjectRole.OWNER, ProjectRole.MANAGER]}
                userRole={userRole}
                showChildren={false}
              >
                <div className="flex flex-col space-y-0.5">
                  <h3 className="text-xs font-light text-gray-400">Роль</h3>
                  <Select
                    value={el.role}
                    onValueChange={(value) =>
                      onRoleChange?.(el.user?.user_id, value as ProjectRole)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProjectRole.MANAGER}>
                        Менеджер
                      </SelectItem>
                      <SelectItem value={ProjectRole.EXECUTOR}>
                        Исполнитель
                      </SelectItem>
                      <SelectItem value={ProjectRole.GUEST}>Гость</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </RoleComponent>
              <RoleComponent
                roles={[ProjectRole.OWNER, ProjectRole.MANAGER]}
                userRole={userRole}
                showChildren={false}
              >
                <Button
                  variant="destructive"
                  onClick={() => onRemove?.(el.user?.user_id)}
                >
                  Удалить пользователя с проекта
                </Button>
              </RoleComponent>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
