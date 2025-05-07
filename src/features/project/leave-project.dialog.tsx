import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeaveProjectSharedMutation } from "@/shared/api/projects-shared.service";
import { useLazyGetProjectsQuery } from "@/shared/api/projects.service";
import { useNavigate } from "react-router-dom";

interface props {
  project_id: string;
  member_id: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (data: boolean) => void;
  projectRefetch: () => void;
}

export default function LeaveProjectDialog({
  project_id,
  member_id,
  dialogIsOpen,
  setDialogIsOpen,
}: props) {
  const navigate = useNavigate();
  const [refetch] = useLazyGetProjectsQuery();
  const [leave, { isLoading: isLoadingLeave }] =
    useLeaveProjectSharedMutation();

  function leaveHandler() {
    leave({ project_id, member_id })
      .unwrap()
      .then(() => {
        refetch({
          page: 1,
        })
          .unwrap()
          .then(() => {
            setDialogIsOpen(false);
            navigate(`/${ROUTES.PROJECTS}`);
          });
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
            <DialogTitle>Приглашения на проект</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите покинуть проект?</p>
          <p>
            Проект будет находится в приглашениях, пока вы его не удлаите.
            Владелец проекта получит уведомление о вашем выходе и также сможет
            удалить вас из проекта.
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              isLoading={isLoadingLeave}
              disabled={isLoadingLeave}
              onClick={async () => {
                leaveHandler();
              }}
            >
              Покинуть проект
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
