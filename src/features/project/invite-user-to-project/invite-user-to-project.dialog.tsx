import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteUserToProjectForm from "../forms/invite-user-to-project.form";

interface props {
  project_id: string;
  user_id: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (data: boolean) => void;
}

export default function InviteUserToProjectDialog({
  project_id,
  user_id,
  dialogIsOpen,
  setDialogIsOpen,
}: props) {
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
          <p>Вы уверены, что хотите пригласить этого пользователя на проект?</p>

          <InviteUserToProjectForm
            onSuccess={() => {
              setDialogIsOpen(false);
            }}
            onClose={() => {
              setDialogIsOpen(false);
            }}
            project_id={project_id}
            user_id={user_id || ""}
            memberRate={0}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
