import { ROUTES } from "@/app/router/routes.enum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { LockKeyhole } from "lucide-react";
import { HTMLAttributes, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props extends HTMLAttributes<HTMLDivElement> {
  subscriptions: Array<SUBSCRIPTION>;
  lockPosition?: "left" | "right";
}

export default function PrivateComponent({
  lockPosition = "left",
  subscriptions,
  children,
  ...props
}: Props) {
  const { data: subscData } = useGetSubscriptionsQuery();
  const [access, setAccess] = useState<boolean | null>(null);
  const [dialog, setDialog] = useState<boolean>(false);

  function accessHandler() {
    if (!access) {
      setDialog((prev) => !prev);
    }
  }

  useEffect(() => {
    const hasAccess = subscriptions.includes(
      (subscData?.planId as SUBSCRIPTION) || ""
    );
    setAccess(hasAccess);
  }, [subscData?.planId, subscriptions]);

  return (
    <>
      <div onClick={accessHandler} {...props}>
        <div
          className={`${!access && "pointer-events-none"} relative grayscale-[100%]`}
        >
          {!access && (
            <Badge
              variant={"secondary"}
              className={`${lockPosition === "left" ? "left-1 -translate-x-1/2" : "right-1 translate-x-1/2"} absolute p-1 bg-black/50 text-rose-400 z-10 bottom-1   translate-y-2 uppercase`}
            >
              <LockKeyhole />
            </Badge>
          )}
          {children}
        </div>
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подписка</DialogTitle>

            <div className="flex flex-col gap-2">
              <p>{`Эта функция доступна тольк опльзователям с подсписками: `}</p>
              <div className="pt-3 uppercase">
                {Object.values(subscriptions).map((el) => (
                  <Badge key={el} className="mx-1">
                    {el}
                  </Badge>
                ))}
              </div>
              <Link className="mt-4 self-center" to={"/" + ROUTES.PLANS}>
                <Button>Обновить план</Button>
              </Link>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
