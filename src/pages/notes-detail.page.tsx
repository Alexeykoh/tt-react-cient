import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Loader } from "lucide-react";
import {
  useEditNotesMutation,
  useGetNotesByIdQuery,
} from "@/shared/api/notes.service";
import TiptapEditor from "@/components/TiptapEditor";

const NotesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: note,
    isLoading,
    isError,
  } = useGetNotesByIdQuery({ note_id: id || "" }, { skip: !id });
  const [update, { isLoading: isSaving }] = useEditNotesMutation();

  const [content, setContent] = useState<string>("");

  const handleSave = async () => {
    if (id) {
      try {
        await update({
          note_id: id,
          name: note?.name || "Без названия",
          text_content: content,
        }).unwrap();
      } catch (error) {
        console.error("Ошибка при сохранении заметки:", error);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
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
      <Button
        variant="ghost"
        className="w-fit flex items-center gap-2"
        onClick={handleBack}
      >
        <ChevronLeft size={16} />
        Назад
      </Button>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{note?.name || "Без названия"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 p-4 bg-black rounded-xl">
            {/* <TiptapEditor
              initialContent={note?.text_content || ""}
              onChange={setContent}
            /> */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Сохранить
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotesDetailPage;
