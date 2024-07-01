// /fields/RichTextField.tsx
import React from 'react'
import { useField } from 'payload/components/forms'
import TinyMCEEditor from '../components/TinyMCEEditor'

interface RichTextFieldProps {
  path: string
  label: string
}

const RichTextField: React.FC<RichTextFieldProps> = ({ path, label }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })

  return (
    <div>
      <label>{label}</label>
      <TinyMCEEditor value={value || ''} onChange={setValue} />
      {showError && <div className="error">{errorMessage}</div>}
    </div>
  )
}

export default RichTextField
