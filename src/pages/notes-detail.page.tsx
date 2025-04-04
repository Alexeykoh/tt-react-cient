import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  Table,
  CheckSquare,
} from "lucide-react";
import {
  useEditNotesMutation,
  useGetNotesByIdQuery,
} from "@/shared/api/notes.service";
import { Input } from "@/components/ui/input";
import StarterKit from "@tiptap/starter-kit";
import { Card, CardContent } from "@/components/ui/card";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import TableExtension from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotesEditor } from "@/widgets/notes/note-editor";

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2],
    },
  }),
  Placeholder.configure({
    placeholder: "Начните писать заметку здесь...",
  }),
  LinkExtension.configure({
    openOnClick: false,
    autolink: true,
  }),
  TableExtension.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];

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
    text: "",
  });

  const editor = useEditor({
    extensions,
    content: note?.text_content || "",
    onBlur: () => {
      setTimeout(() => {
        handleSave();
      }, 500);
    },
  });

  const handleSave = async () => {
    if (id && editor) {
      try {
        await update({
          note_id: id,
          name: contentNote.name || "Без названия",
          text_content: editor.getHTML(),
        }).unwrap();
      } catch (error) {
        console.error("Ошибка при сохранении заметки:", error);
      }
    }
  };

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Введите URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  useEffect(() => {
    if (!note) return;

    setContent({ name: note.name, text: note.text_content });
    if (editor && note.text_content) {
      editor.commands.setContent(note.text_content);
    }
  }, [note, editor]);

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
          onBlur={handleSave}
        />
      </div>

      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{
                duration: 100,
                maxWidth: "none",
                placement: "top-start",
                offset: [0, 10],
              }}
              className="[&>div]:max-w-[90vw]"
            >
              <ScrollArea className="w-full">
                <div className="flex gap-1 p-1 border rounded-md shadow-sm w-max">
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleBold().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleItalic().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleStrike().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("code")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleCode().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Code className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("link")}
                    onPressedChange={setLink}
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Link className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    onPressedChange={addTable}
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <Table className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    pressed={editor.isActive("taskList")}
                    onPressedChange={() =>
                      editor.chain().focus().toggleTaskList().run()
                    }
                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Toggle>
                </div>
              </ScrollArea>
            </BubbleMenu>
          )}

          {/* <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none focus:outline-none"
          /> */}
          <NotesEditor />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesDetailPage;
