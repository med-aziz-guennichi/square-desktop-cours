import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';



interface TextEditorOneProps {
    value: string;
    onChange: (value: string) => void;
    height?: string;
  }
  
  function TextEditorTwo({ value, onChange, height = '300px' }: TextEditorOneProps) {
    const editor = useCreateBlockNote({
      initialContent: value ? JSON.parse(value) : undefined,
    });
  
    return (
      <div>
        <BlockNoteView
          editor={editor}
          className={`max-h-[${height}] overflow-auto w-full border-2 rounded-md bg-white`}
          onChange={(e) => {
            onChange(JSON.stringify(e.document));
          }}
        />
      </div>
    );
  }
  
  export default TextEditorTwo;
  