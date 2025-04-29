import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/dateUtils";
import {
  useCreateNotesMutation,
  useDeleteNotesMutation,
  useGetNotesQuery,
} from "@/shared/api/notes.service";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: notes } = useGetNotesQuery({ page: 1 });
  const [createNotes] = useCreateNotesMutation();
  const [deleteNotes] = useDeleteNotesMutation();
  const [notesDelete, setNotesToDelete] = useState<string | null>(null);

  function createNotesHandler() {
    createNotes({ name: "Новая заметка", text_content: "" });
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex flex-row items-center justify-between gap-6 w-full">
        <h1 className="text-2xl font-bold">Заметки</h1>
        <Button onClick={createNotesHandler}>Добавить заметку</Button>
      </div>

      {/* Диалог удаления вынесен ВНЕ цикла */}
      <Dialog
        open={notesDelete !== null}
        onOpenChange={() => setNotesToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить заметку?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setNotesToDelete(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (notesDelete) {
                  await deleteNotes({ id: notesDelete });
                  setNotesToDelete(null);
                }
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-4 w-full overflow-y-auto">
        {notes?.data.map((el) => (
          <Card
            key={el?.notes_id} // Ключ должен быть здесь
            className="min-w-64 w-full md:w-fit max-w-64 max-h-96"
          >
            <CardHeader>
              <div className="flex items-center gap-2 w-full">
                <CardTitle className="w-full">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col">
                      <p className="text-xs opacity-70">
                        {formatDate(el?.updated_at)}
                      </p>
                      <p className="text-xl font-semibold">{el?.name}</p>
                    </div>
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
                          className="text-destructive focus:text-destructive"
                          onClick={() => setNotesToDelete(el.notes_id || "")}
                        >
                          <TrashIcon className="mr-2 size-4" />
                          <span>Удалить</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            {/* <CardContent className="flex">
              <div className="text-xs font-light min-h-32 max-h-32 overflow-clip">
                {el.text_content}
              </div>
            </CardContent> */}
            <CardFooter className="space-x-2">
              <Button onClick={() => navigate("/notes/" + el?.notes_id)}>
                Перейти
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
