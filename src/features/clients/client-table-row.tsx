import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useDeletelientsMutation } from "@/shared/api/client.service";
import UpdateClientForm from "@/features/clients/update-clients.form";
import { Client } from "@/shared/interfaces/client.interface";

export default function ClientTableRow(client: Client) {
  const [deleteClient] = useDeletelientsMutation();
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  return (
    <>
      {client && (
        <>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Обновить клиента</DialogTitle>
              </DialogHeader>
              <UpdateClientForm
                onSuccess={() => setEditDialogIsOpen(false)}
                onClose={() => setEditDialogIsOpen(false)}
                defaults={client}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={clientToDelete !== null}
            onOpenChange={() => setClientToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
              </DialogHeader>
              <p>Вы уверены, что хотите удалить этого клиента?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setClientToDelete(null)}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deleteClient({ id: clientToDelete || "" });
                    setClientToDelete(null);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <TableCell className="font-medium flex items-center">
        {client?.name}
      </TableCell>
      <TableCell className="">{client?.contact_info}</TableCell>
      <TableCell className="flex justify-end pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted ml-auto"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => {
                setEditDialogIsOpen(true);
              }}
            >
              <PencilIcon className="mr-2 size-4" />
              <span>Редактировать</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setClientToDelete(client.client_id || "")}
            >
              <TrashIcon className="mr-2 size-4" />
              <span>Удалить</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </>
  );
}
