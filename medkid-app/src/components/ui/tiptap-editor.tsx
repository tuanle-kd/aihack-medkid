'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo2,
  Redo2,
} from 'lucide-react';

interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({ value, onChange, disabled = false, placeholder, className }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Soạn thảo nội dung...' }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none min-h-[18rem] focus:outline-none px-4 py-3 text-slate-800 leading-relaxed',
          disabled && 'opacity-60 cursor-not-allowed'
        ),
      },
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    if (editor && editor.getText() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div className={cn('rounded-2xl border border-teal-200/60 bg-teal-50/10 overflow-hidden focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition-all', className)}>
      {/* Toolbar */}
      {!disabled && (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-teal-100/60 bg-white/60">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="In đậm"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Nghiêng"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Tiêu đề"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Danh sách"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Danh sách có số"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarBtn
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Hoàn tác"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Làm lại"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <span className="ml-auto text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/40">
            Bác sĩ soạn thảo tự do
          </span>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-7 w-7 flex items-center justify-center rounded-lg transition-colors',
        active ? 'bg-teal-100 text-teal-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}
