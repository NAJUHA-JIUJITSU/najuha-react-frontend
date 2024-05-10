import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import './MarkdownEditor.css'
import { a } from 'react-spring'
import axios from 'axios'
function MarkdownEditor({ data, mode, onChange }) {
  const [markdownData, setMarkdownData] = useState(data)

  //"https://drive.google.com/uc?export=view&id=1tRW3UvzVeSHMFghCxmv93ukMUOnpkrz7"에 get요청해줘
  async function fetchGoogleDriveImage(fileId) {
    const url = `https://drive.google.com/uc?export=view&id=${fileId}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Process the response here. For images, you might want to convert it to a blob
      const imageBlob = await response.blob()
      const imageUrl = URL.createObjectURL(imageBlob)

      console.log('Image URL:', imageUrl)
      // You can use the imageUrl to display the image, for example by setting it as the src of an img element
    } catch (error) {
      console.error('Error fetching image:', error)
    }
  }

  useEffect(() => {
    fetchGoogleDriveImage('1tRW3UvzVeSHMFghCxmv93ukMUOnpkrz7')
  }, [])

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
