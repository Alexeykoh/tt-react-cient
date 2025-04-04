import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader } from "lucide-react";
import {
  useEditNotesMutation,
  useGetNotesByIdQuery,
} from "@/shared/api/notes.service";
import { Input } from "@/components/ui/input";
import { NotesPageWidget } from "@/widgets/notes/note-page";


const NotesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: note,
    isLoading,
    isError,
  } = useGetNotesByIdQuery({ note_id: id || "" }, { skip: !id });
  const [update] = useEditNotesMutation();

  const [content, setContent] = useState<{ name: string; text: string }>({
    name: "",
    text: "",
  });

  const handleSave = async () => {
    if (id) {
      try {
        if (
          content.name === note?.name &&
          content.text === note?.text_content
        ) {
          return;
        }
        await update({
          note_id: id,
          name: content.name || "Без названия",
          text_content: content.text,
        }).unwrap();
      } catch (error) {
        console.error("Ошибка при сохранении заметки:", error);
      }
    }
  };

  useEffect(() => {
    if (!note) {
      return;
    }
    setContent({ name: note?.name, text: note?.text_content });
  }, [note]);

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
          value={content.name}
          className="text-2xl font-semibold border-none"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setContent((el) => {
              return { ...el, name: e.target.value };
            });
          }}
          onBlur={handleSave}
        />
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-stone-900">
        {/* <Textarea
          placeholder="Ваша заметка начинается здесь"
          className="resize-none min-h-96 h-full border-none p-4 rounded-2xl"
          value={content.text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent((el) => {
              return { ...el, text: e.target.value };
            });
          }}
          onBlur={handleSave}
        /> */}
       <NotesPageWidget />
      </div>
    </div>
  );
};

export default NotesDetailPage;
