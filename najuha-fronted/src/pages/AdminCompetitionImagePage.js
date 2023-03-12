import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Cookies } from 'react-cookie'
import { postAdminCompetitionPoster } from '../apis/api/admin'

function AdminCompetitionImagePage() {
  const cookies = new Cookies()
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileChange = e => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('competition-poster', file)

    const response = await postAdminCompetitionPoster(id, formData)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '30px', marginTop: '100px' }}>
        id:{id} 대회 포스터 등록
      </h1>
      <img
        style={{ width: '194px', height: '264px' }}
        src={previewUrl}
        alt="preview"
      />
      <div style={{ textAlign: 'center' }}>
        <input type="file" onChange={handleFileChange} />
        <button
          style={{ width: '100px', height: '80px' }}
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  )
}

export default AdminCompetitionImagePage
