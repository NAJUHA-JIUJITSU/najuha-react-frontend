import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  postAdminCompetitionPoster,
  postAdminCompetitionBracket,
} from '../apis/api/admin'

function AdminCompetitionImagePage() {
  const { id } = useParams()
  const [imgFile, setImgFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [csvFile, setCsvFile] = useState(null)

  const handleImgFileChange = e => {
    const selectedFile = e.target.files[0]
    setImgFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleImgUpload = async () => {
    try {
      const formData = new FormData()
      formData.append('competition-poster', imgFile)
      await postAdminCompetitionPoster(id, formData)
      alert('이미지 업로드 성공')
    } catch (error) {
      alert('이미지 업로드 실패')
      console.log(error)
    }
  }

  const handleCsvFileChange = e => {
    const selectedFile = e.target.files[0]
    setCsvFile(selectedFile)
  }

  const handleCsvUpload = async () => {
    try {
      const formData = new FormData()
      formData.append('competition-bracket', csvFile)
      await postAdminCompetitionBracket(id, formData)
      alert('대진표 업로드 성공')
    } catch (error) {
      alert('대진표 업로드 실패')
      console.log(error)
    }
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
        <input type="file" onChange={handleImgFileChange} />
        <button
          style={{ width: '100px', height: '80px' }}
          onClick={handleImgUpload}
        >
          Img Upload
        </button>
      </div>
      <div>
        <h1 style={{ fontSize: '30px', marginTop: '100px' }}>
          id:{id} 대회 대진표 등록
        </h1>
        <div style={{ textAlign: 'center' }}>
          <input type="file" onChange={handleCsvFileChange} />
          <button
            style={{ width: '100px', height: '80px' }}
            onClick={handleCsvUpload}
          >
            CSV Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminCompetitionImagePage
