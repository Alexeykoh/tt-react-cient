import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAcceptFriendshipMutation } from "@/shared/api/friendship.service";
import { Friendship } from "@/shared/interfaces/friends.interface";
import { useEffect, useState } from "react";

interface props {
  meta: string | null;
}

export default function FriendshipInvitationDialog({ meta }: props) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [metaData, setMetaData] = useState<Friendship | null>(null);

  const [accept, { isLoading }] = useAcceptFriendshipMutation();

  useEffect(() => {
    if (meta) {
      setMetaData(JSON.parse(meta) as Friendship);
    }
  }, [meta]);

  return (
    <>
      <Dialog
        open={dialogIsOpen}
        onOpenChange={(data) => setDialogIsOpen(data)}
      >
        {metaData && (
          <DialogTrigger>
            <Button>Принять приглашение</Button>
          </DialogTrigger>
        )}

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Вы уверены что хотите принять приглашение?
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(false)}>
              Отмена
            </Button>
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              variant="destructive"
              onClick={() => {
                accept(metaData?.friendship_id || '')
                  .unwrap()
                  .then(() => setDialogIsOpen(false));
              }}
            >
              Принять приглашение
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
