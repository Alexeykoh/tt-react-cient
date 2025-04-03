import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSubscription } from "@/hooks/use-subscription";
import { SUNSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { LockKeyhole } from "lucide-react";
import { HTMLAttributes, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  subscriptions: Array<SUNSCRIPTION>;
  lockPosition?: "left" | "right";
}

export default function PrivateComponent({
  lockPosition = "left",
  subscriptions,
  children,
  ...props
}: Props) {
  const { access } = useSubscription(subscriptions);
  const [dialog, setDialog] = useState<boolean>(false);

  function accessHandler() {
    if (!access) {
      setDialog((prev) => !prev);
    }
  }
  return (
    <>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogTrigger>
          <div className="" onClick={accessHandler} {...props}>
            <div className={`${!access && "pointer-events-none"} relative`}>
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
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подписка</DialogTitle>
            <DialogDescription>
              <p>{`Эта функция доступна тольк опльзователям с подсписками: `}</p>
              <div className="pt-3 uppercase">
                {Object.values(subscriptions).map((el) => (
                  <Badge className="mx-1">{el}</Badge>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
