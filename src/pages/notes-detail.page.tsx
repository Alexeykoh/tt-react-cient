import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader } from "lucide-react";
import {
  useEditNotesMutation,
  useGetNotesByIdQuery,
} from "@/shared/api/notes.service";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { Block, NotesEditor } from "@/widgets/notes/note-editor";

const firstMessage: string = JSON.stringify([
  {
    id: uuidv4(),
    type: "heading1",
    content: "Новая заметка",
  },
  {
    id: uuidv4(),
    type: "text",
    content: "Начните писать здесь...",
  },
]);

const NotesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: note,
    isLoading,
    isError,
  } = useGetNotesByIdQuery({ note_id: id || "" }, { skip: !id });
  const [update] = useEditNotesMutation();

  const [contentNote, setContent] = useState<{ name: string; text: string }>({
    name: "",
    text: firstMessage,
  });

  const handleSave = async (noteData?: string) => {
    if (id) {
      try {
        await update({
          note_id: id,
          name: contentNote.name || "Без названия",
          text_content: noteData ? JSON.stringify(noteData) : "",
        }).unwrap();
      } catch (error) {
        console.error("Ошибка при сохранении заметки:", error);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">Ошибка загрузки заметки</div>
    );

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button
          size={"icon"}
          variant={"default"}
          onClick={() => navigate("/notes")}
        >
          <ChevronLeft />
        </Button>
        <Input
          value={contentNote.name}
          className="text-2xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setContent((el) => {
              return { ...el, name: e.target.value };
            });
          }}
          onBlur={() => handleSave()}
        />
      </div>

      <Card className="border-0 shadow-none bg-[#404040]/80 min-h-96">
        <CardContent className="p-0">
          <NotesEditor
            sendToServer={handleSave}
            updateState={function (state: Block[]): void {
              throw new Error("Function not implemented.");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesDetailPage;
