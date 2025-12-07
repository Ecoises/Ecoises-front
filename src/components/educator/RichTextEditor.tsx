import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote'],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'blockquote',
  'link', 'image'
];

const RichTextEditor = ({ content, onChange, placeholder = "Escribe el contenido de tu lección..." }: RichTextEditorProps) => {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card rich-text-editor">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[300px] [&_.ql-container]:min-h-[260px] [&_.ql-editor]:min-h-[260px] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border [&_.ql-toolbar]:bg-muted/30 [&_.ql-container]:border-0 [&_.ql-editor]:text-foreground [&_.ql-editor.ql-blank::before]:text-muted-foreground"
      />
    </div>
  );
};

export default RichTextEditor;
