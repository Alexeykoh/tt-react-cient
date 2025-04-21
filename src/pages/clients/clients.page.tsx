import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import CreateClientForm from "@/features/clients/create-clients.form";
import { useGetClientsQuery } from "@/shared/api/client.service";
import React, { useState } from "react";
import ClientTableRow from "./client-table-row";

const ClientsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const { data: clients } = useGetClientsQuery({ page: currentPage });

  return (
    <>
      <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex flex-wrap justify-between gap-2">
          <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            <Table className="flex-1 w-full">
              <TableHeader>
                <TableHead>
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
                </TableHead>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ClientsPage;
