


import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

const RichTextEditor = ({ input, setInput }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: input.description,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setInput({ ...input, description: html });
    },
  });

  // Update editor when initial data loads
  useEffect(() => {
    if (editor && input.description !== editor.getHTML()) {
      editor.commands.setContent(input.description);
    }
  }, [input.description, editor]);

  return (
    <div className="rounded-md border p-2 min-h-[150px]">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;