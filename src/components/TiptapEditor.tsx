import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor: React.FC<{
  initialContent?: string;
  onChange: (content: string) => void;
}> = ({ initialContent = '', onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
