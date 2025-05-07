import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProjectMemberForm from "./forms/edit-project-member.form";
import { useGetProjectsSharedByMemberIdQuery } from "@/shared/api/projects-shared.service";

interface props {
  project_id: string;
  member_id: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (data: boolean) => void;
}

export default function EditProjectMemberDialog({
  project_id,
  member_id,
  dialogIsOpen,
  setDialogIsOpen,
}: props) {
  const { data: member } = useGetProjectsSharedByMemberIdQuery(
    {
      member_id: member_id,
    },
    { skip: !member_id }
  );

  return (
    <>
      <Dialog
        open={dialogIsOpen}
        onOpenChange={(data) => setDialogIsOpen(data)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать участника</DialogTitle>
          </DialogHeader>
          {member && (
            <EditProjectMemberForm
              onSuccess={() => setDialogIsOpen(false)}
              onClose={() => setDialogIsOpen(false)}
              initialData={{
                project_id: project_id,
                member_id: member?.member_id,
                role: member?.role,
                payment_type: member?.payment_type,
                rate: Number(member?.rate),
                currency_id: String(member?.currency?.currency_id),
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
