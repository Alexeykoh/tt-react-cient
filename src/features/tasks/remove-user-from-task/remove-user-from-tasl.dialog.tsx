import { useRemoveUserFromTaskMutation } from "@/shared/api/task.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface props {
  user_id: string;
  task_id: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (value: boolean) => void;
}

function RemoveUserFromTaskDialog({
  user_id,
  task_id,
  dialogIsOpen,
  setDialogIsOpen,
}: props) {
  const [remove, { isLoading: isLoadingRemove }] =
    useRemoveUserFromTaskMutation();

  function removeHandler() {
    remove({
      taskId: task_id,
      userId: user_id,
    })
      .unwrap()
      .finally(() => {
        setDialogIsOpen(false);
      });
  }

  return (
    <>
      <Dialog
        open={dialogIsOpen}
        onOpenChange={(data) => setDialogIsOpen(data)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этого пользователя с задачи?</p>
          <p className="text-xs">
            Все связанные действия с этим пользователем будут удалены, после
            чего пользователю будет отправленно уведомление о снятии с задачи.
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              isLoading={isLoadingRemove}
              disabled={isLoadingRemove}
              onClick={async () => {
                removeHandler();
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RemoveUserFromTaskDialog;
