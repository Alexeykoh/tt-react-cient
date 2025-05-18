import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NOTIFICATION_TYPE } from "@/shared/enums/notification-type.enum";
import { JSX } from "react";
import FriendshipInvitationDialog from "./dialogs/friendship_invitation.dialog";

interface props {
  children: JSX.Element;
  notificationType: NOTIFICATION_TYPE;
  metaDataProp: string | null;
}

export default function NotificationsDialog({
  children,
  notificationType,
  metaDataProp: meta,
}: props) {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="cursor-pointer flex items-start">{children}</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>Уведомление</DialogTitle>
              {notificationType}
            </DialogHeader>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>{children}</div>
            <div className="flex w-fill justify-end">
              {switchDialogs(notificationType, meta)}
            </div>
          </div>
        </DialogContent>
        <DialogFooter>{}</DialogFooter>
      </Dialog>
    </>
  );
}

function switchDialogs(
  notificationType: NOTIFICATION_TYPE,
  meta: string | null
) {
  switch (notificationType) {
    case NOTIFICATION_TYPE.FRIENDSHIP_INVITATION:
      return <FriendshipInvitationDialog meta={meta} />;
  }
}
