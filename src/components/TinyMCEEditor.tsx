// /components/TinyMCEEditor.tsx
import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
interface TinyMCEEditorProps {
  value: string
  onChange: (content: string) => void
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  const handleEditorChange = (content: string, editor: any) => {
    onChange(content)
  }

  return (
    <div className="tinymce-container">
      <Editor
        apiKey="9xc4d89ofk8dvfad5hx6hl79qdddvi8infdgwjcvnxn9l53n"
        value={value}
        init={{
          height: 600, // Sử dụng 100% của vùng chứa
          menubar: true,
          plugins:
            'advlist anchor autolink autosave code codesample directionality fullscreen help image imagetools insertdatetime link lists media nonbreaking pagebreak preview print quickbars searchreplace table template toc visualblocks visualchars wordcount emoticons charmap hr spellchecker',
          toolbar:
            'undo redo | blocks | bold italic | alignleft aligncentre alignright alignjustify | indent outdent | bullist numlist',
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  )
}

export default TinyMCEEditor
