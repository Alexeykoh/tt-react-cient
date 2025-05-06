import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteRoleProjectSharedMutation } from "@/shared/api/projects-shared.service";

interface props {
  user_id: string;
  project_id: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (value: boolean) => void;
}

function RemoveUserFromProjectDialog({
  user_id,
  project_id,
  dialogIsOpen,
  setDialogIsOpen,
}: props) {
  const [remove, { isLoading: isLoadingRemove }] =
    useDeleteRoleProjectSharedMutation();

  function removeHandler() {
    remove({
      project_id: project_id,
      user_id: user_id,
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
          <p>Вы уверены, что хотите удалить этого пользователя с проекта?</p>
          <p className="text-xs">
            Все связанные действия с этим пользователем будут удалены, после
            чего пользователю будет отправленно уведомление о удалении с
            проекта.
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

export default RemoveUserFromProjectDialog;
