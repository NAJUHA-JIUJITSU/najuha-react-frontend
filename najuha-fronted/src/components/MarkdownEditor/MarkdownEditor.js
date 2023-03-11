import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import './MarkdownEditor.css'

function MarkdownEditor({ data, mode, onChange }) {
  const [markdownData, setMarkdownData] = useState(data)

  useEffect(() => {
    setMarkdownData(data)
  }, [data])

  const handleMarkdownChange = value => {
    setMarkdownData(value)
    if (onChange) {
      onChange(value)
    }
  }

  const renderEditor = () => {
    const editorProps = {
      value: markdownData,
      onChange: handleMarkdownChange,
    }

    if (mode === 'edit') {
      return (
        <div data-color-mode="light">
          <div className="container">
            <MDEditor {...editorProps} />
          </div>
        </div>
      )
    }

    if (mode === 'view') {
      const markdownProps = {
        source: markdownData,
        style: { whiteSpace: 'pre-wrap', textAlign: 'left' },
      }
      return (
        <div data-color-mode="light">
          <div className="container">
            <MDEditor.Markdown {...markdownProps} />
          </div>
        </div>
      )
    }

    return null
  }

  return <div className="MarkdownEditor">{renderEditor()}</div>
}

export default MarkdownEditor
