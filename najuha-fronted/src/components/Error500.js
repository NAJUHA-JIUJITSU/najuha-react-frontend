import React from 'react'
import './error.css'
import { useNavigate } from 'react-router-dom'

function Error404() {
  const navigate = useNavigate()
  return (
    <div className="Error_wrapper">
      <div className="Error_card">
        <h1>NAJUHA</h1>

        <p style={{ background: '#FFE2E2' }}>500 Error</p>

        <h2>시스템 문제로 페이지를 표시할 수 없습니다.</h2>
        <h3>
          불편을 드려 죄송합니다. <br />
          서버문제로 서비스 이용이 불가능합니다. <br />
          <span style={{ fontWeight: '600' }}>고객센터(0507-0177-1165)</span>로
          문의주시거나 잠시후 다시 시도해주세요.
        </h3>
      </div>
    </div>
  )
}

export default Error404
