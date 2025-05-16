// src/Tiptap.tsx
import { Card, CardContent } from "@/components/ui/card";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

const Tiptap = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <Card>
      <CardContent>
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      </CardContent>
    </Card>
  );
};

export default Tiptap;
