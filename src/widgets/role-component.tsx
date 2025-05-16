import RoleBadge from "@/components/role-badge";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PROJECT_ROLE } from "@/shared/enums/project-role.enum";
import { ShieldX } from "lucide-react";
import { HTMLAttributes, useEffect, useState, useCallback } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  roles: Array<PROJECT_ROLE>;
  userRole: PROJECT_ROLE;
  showChildren?: boolean;
}

export default function RoleComponent({
  roles,
  userRole,
  showChildren = true,
  children,
  ...props
}: Props) {
  const [access, setAccess] = useState<boolean>(false);
  const [dialog, setDialog] = useState<boolean>(false);

  // Проверяем доступ и обновляем состояние
  useEffect(() => {
    const hasAccess = roles.includes(userRole);
    setAccess(hasAccess);
  }, [roles, userRole]);

  // Обработчик клика - открываем диалог только если доступа нет
  const accessHandler = useCallback(() => {
    if (!access) {
      setDialog(true);
    }
  }, [access]);

  // Если доступа нет и showChildren === false - ничего не рендерим
  if (!access && !showChildren) {
    return null;
  }

  return (
    <>
      <div
        onClick={accessHandler}
        {...props}
        style={{ cursor: access ? "unset" : "default" }}
      >
        <div
          className={`relative ${
            !access ? "pointer-events-none grayscale-[100%] opacity-90" : ""
          }`}
        >
          {!access && (
            <div className="absolute p-1 duration-75 bg-black/70 w-full h-full text-rose-400 z-10 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center">
              <Badge variant={"secondary"}>
                <ShieldX />
              </Badge>
            </div>
          )}
          {children}
        </div>
      </div>
      
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ограничение доступа</DialogTitle>

            <div className="flex flex-col gap-2">
              <p>Эта функция доступна только пользователям с ролью:</p>
              <div className="uppercase space-x-3">
                {roles.map((el) => (
                  <RoleBadge key={el} role={el} />
                ))}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
