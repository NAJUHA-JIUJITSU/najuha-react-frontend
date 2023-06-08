import React from 'react'
import './error.css'
import { useNavigate } from 'react-router-dom'

function Error404() {
  const navigate = useNavigate()
  return (
    <div className="Error_wrapper">
      <div className="Error_card">
        <h1>NAJUHA</h1>

        <p className="Error_num">404 Error</p>

        <h2>원하시는 페이지를 찾을 수 없습니다.</h2>
        <h3>
          찾으려는 페이지의 주소가 잘못입력되었거나,
          <br />
          주소의 변경 혹은 삭제로 인 사용하실 수 없습니다.
          <br />
          입력하신 페이지 주소가 정확한지 다시 한 번 확인해주세요.
        </h3>
        <button
          onClick={() => {
            navigate('/')
          }}>
          홈으로 이동
        </button>
      </div>
    </div>
  )
}

export default Error404
