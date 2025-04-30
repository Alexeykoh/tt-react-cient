import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateClientForm from "@/features/clients/create-clients.form";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function ContactsPage() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex flex-wrap justify-between gap-2">
          <h1 className="text-2xl font-bold mb-4">Контакты</h1>
          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild>
              <Button>Добавить клиента</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать нового клиента</DialogTitle>
              </DialogHeader>
              <CreateClientForm
                onSuccess={() => setDialogIsOpen(false)}
                onClose={() => {}}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default ContactsPage;
