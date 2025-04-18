import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export function TextEditorOne({
  form,
  index,
}: {
  form: UseFormReturn<FieldValues, object, FieldValues>;
  index: number;
}) {
  // Creates a new editor instance.
  const initialValue = form.watch(`chapters.${index}.jsonFiles`);
  const editor = useCreateBlockNote({
    initialContent: initialValue ? JSON.parse(initialValue) : undefined,
  });
  // Renders the editor instance using a React component.
  return (
    <div>
      <BlockNoteView
        editor={editor}
        className="h-[500px] max-h-[500px] overflow-auto w-full border-2 rounded-md"
        onChange={(e) => {
          // Set the editor content to the form field
          form.setValue(`chapters.${index}.jsonFiles`, JSON.stringify(e.document));
        }}
      />
    </div>
  );
}
