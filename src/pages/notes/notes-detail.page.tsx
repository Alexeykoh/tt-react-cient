import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Type,
  Heading2,
  Heading1,
  Heading3,
  Link2Icon,
  Code2,
} from "lucide-react";
import {
  useEditNotesMutation,
  useGetNotesByIdQuery,
} from "@/shared/api/notes.service";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";

import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("python", python);


// Компонент меню форматирования, отображается при выделении текста
function FloatingMenu({ editor }: { editor: Editor | null }) {
  console.log("FloatingMenu render", { editor });
  if (!editor) {
    console.log("FloatingMenu: editor is null");
    return null;
  }

  // Показывать меню только если есть выделение
  if (editor.state.selection.empty) {
    console.log("FloatingMenu: selection empty");
    return null;
  }

  console.log("FloatingMenu: rendered and visible");
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 100,
        padding: "8px",
        backgroundColor: "#222",
        borderRadius: "6px",
        display: "flex",
        gap: "8px",
        color: "white",
        userSelect: "none",
      }}
    >
      <Button
        size="icon"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => {
          console.log("Bold button clicked", editor.getJSON());
          editor.chain().focus().toggleBold().run();
        }}
        aria-label="Bold"
        title="Жирный (Ctrl+B)"
      >
        <Bold size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => {
          console.log("Italic button clicked", editor.getJSON());
          editor.chain().focus().toggleItalic().run();
        }}
        aria-label="Italic"
        title="Курсив (Ctrl+I)"
      >
        <Italic size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("code") ? "default" : "outline"}
        onClick={() => {
          console.log("Code button clicked", editor.getJSON());
          editor.chain().focus().toggleCode().run();
        }}
        aria-label="Inline Code"
        title="Код"
      >
        <Code2 size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("codeBlock") ? "default" : "outline"}
        onClick={() => {
          console.log("CodeBlock button clicked", editor.getJSON());
          editor.chain().focus().toggleCodeBlock().run();
        }}
        aria-label="Code Block"
        title="Блок кода"
      >
        <Type size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => {
          console.log("BulletList button clicked", editor.getJSON());
          editor.chain().focus().toggleBulletList().run();
        }}
        aria-label="Bullet List"
        title="Маркированный список"
      >
        <List size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() => {
          console.log("OrderedList button clicked", editor.getJSON());
          editor.chain().focus().toggleOrderedList().run();
        }}
        aria-label="Ordered List"
        title="Нумерованный список"
      >
        <ListOrdered size={16} />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "outline"
        }
        onClick={() => {
          console.log("Heading1 button clicked", editor.getJSON());
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        aria-label="Heading 1"
        title="Заголовок 1"
      >
        <Heading1 size={16} />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        onClick={() => {
          console.log("Heading2 button clicked", editor.getJSON());
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        aria-label="Heading 2"
        title="Заголовок 2"
      >
        <Heading2 size={16} />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "outline"
        }
        onClick={() => {
          console.log("Heading3 button clicked", editor.getJSON());
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        aria-label="Heading 3"
        title="Заголовок 3"
      >
        <Heading3 size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("link") ? "default" : "outline"}
        onClick={() => {
          console.log("Link button clicked", editor.getJSON());
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("Введите URL", previousUrl || "https://");
          if (url === null) return; // отмена
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        aria-label="Link"
        title="Ссылка"
      >
        {editor.isActive("link") ? (
          <Link2Icon size={16} />
        ) : (
          <LinkIcon size={16} />
        )}
      </Button>
    </div>
  );
}

export default function NotesDetailPage() {
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

  useEffect(() => {
    if (note) {
      setContent({
        name: note.name,
        text: note.text_content || JSON.stringify({ type: "doc", content: [] }),
      });
    }
  }, [note]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Code,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      BulletList,
      OrderedList,
      ListItem,
      Heading,
    ],
    content: contentNote.text ? JSON.parse(contentNote.text) : "<p></p>",
    onUpdate: ({ editor }) => {
      console.log("onUpdate called", editor.getJSON());
      setContent((prev) => ({
        ...prev,
        text: JSON.stringify(editor.getJSON()),
      }));
    },
  });

  const handleSave = async () => {
    if (id) {
      try {
        await update({
          note_id: id,
          name: contentNote.name || "Без названия",
          text_content: contentNote.text || "",
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
    <div className="w-full h-full p-4 flex flex-col gap-4 relative">
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

      <Card className="border-0 shadow-none bg-[#404040]/80 min-h-96 relative">
        <CardContent className="relative">
          <EditorContent
            editor={editor}
            className="prose prose-invert max-w-full min-h-[24rem] focus:outline-none"
            tabIndex={0}
          />
          <FloatingMenu editor={editor} />
        </CardContent>
      </Card>
    </div>
  );
}
