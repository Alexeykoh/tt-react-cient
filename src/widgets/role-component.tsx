import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectRole } from "@/shared/enums/project-role.enum";
import { ShieldX } from "lucide-react";
import { HTMLAttributes, useEffect, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  roles: Array<ProjectRole>;
  userRole: ProjectRole;
  showChildren?: boolean;
}

export default function RoleComponent({
  roles,
  userRole,
  showChildren = true,
  children,
  ...props
}: Props) {
  const [access, setAccess] = useState<boolean | null>(null);
  const [dialog, setDialog] = useState<boolean>(false);

  function accessHandler() {
    if (!access) {
      setDialog(true);
    }
  }

  useEffect(() => {
    const hasAccess = roles.includes(userRole);
    setAccess(hasAccess);
  }, [roles, userRole]);

  if (!access && !showChildren) {
    return null;
  }

  return (
    <>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <div onClick={accessHandler} {...props}>
          <div
            className={`${!access && "pointer-events-none"} relative grayscale-[100%] opacity-90`}
          >
            {!access && (
              <Badge
                variant={"secondary"}
                className={`absolute p-1 bg-black/80 w-full h-full text-rose-400 z-10 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 uppercase`}
              >
                <ShieldX />
              </Badge>
            )}
            {children}
          </div>
        </div>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ограничение доступа</DialogTitle>

            <div className="flex flex-col gap-2">
              <p>{`Эта функция доступна тольк опльзователям с ролью: `}</p>
              <div className="pt-3 uppercase">
                {Object.values(roles).map((el) => (
                  <Badge key={el} className="mx-1">
                    {el}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
