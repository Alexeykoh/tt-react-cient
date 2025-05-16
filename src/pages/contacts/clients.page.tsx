import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientTableRow from "@/features/clients/client-table-row";
import CreateClientForm from "@/features/clients/create-clients.form";
import { useGetClientsQuery } from "@/shared/api/client.service";
import { useState } from "react";

function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const { data: clients } = useGetClientsQuery({ page: currentPage });

  return (
    <>
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex flex-wrap justify-between gap-2">
          <h1 className="text-xl font-bold mb-4">Клиенты</h1>
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
          <div className="flex-1 flex flex-col">
            <Table className="flex-1 w-full">
              <TableHeader>
                <TableHead></TableHead>
                <TableRow>
                  <TableHead className="w-[30%]">Наименование</TableHead>
                  <TableHead className="w-[20%]">Контакт</TableHead>
                  <TableHead className="w-[10%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="flex-1">
                {clients?.data &&
                  clients?.data.map((el) => {
                    return (
                      <TableRow key={el.client_id}>
                        <ClientTableRow {...el} />
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {clients?.meta && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Страница {clients.meta.page} из {clients.meta.totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage <= 1}
                  >
                    Назад
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, clients.meta.totalPages)
                      )
                    }
                    disabled={currentPage >= clients.meta.totalPages}
                  >
                    Вперед
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientsPage;
