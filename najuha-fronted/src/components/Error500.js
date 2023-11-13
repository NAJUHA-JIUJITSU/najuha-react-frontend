import React from 'react'
import './error.css'
import { useNavigate } from 'react-router-dom'

function Error404() {
  const navigate = useNavigate()
  const najuhaKakaoUrl = 'https://pf.kakao.com/_meyxmxj'

  return (
    <div className="Error_wrapper">
      <div className="Error_card">
        <h1>NAJUHA</h1>

        <p className="Error_num" style={{ background: '#FFE2E2' }}>
          500 Error
        </p>

        <h2>서비스 점검 안내</h2>
        <h3>
          2023년 11월 14일 오전 1시 ~ 3시 서비스 점검 중입니다. <br />
        </h3>
        <h3>
          불편을 드려 죄송합니다. <br />
          지금은 이 서비스와 연결할 수 없습니다. <br />
        </h3>
        {/* <hr></hr>
        <div className="Error_solution">
          <h3>결제 진행 중 오류가 발생했나요?</h3>
          <ul>
            <li>
              1. 로그아웃 후 <span>재로그인</span> 합니다.
            </li>
            <li>
              2. 오른쪽 상단 벨트 {'>'} 내 프로필 이동 후 <span>회원정보</span>
              를 모두 입력합니다.
            </li>
            <li>
              3. 결제를 진행하는 계좌의 <span>잔액</span>을 확인해주세요.
            </li>
            <li>
              4. 와이파이 또는 데이터 <span>연결상태</span>를 확인해주세요.
            </li>
          </ul>
        </div>
        <hr></hr>
        <div className="Error_final">
          <h3>위 방법으로도 해결이 안된다면?</h3>
          <h4>
            <span
              onClick={() => {
                window.open(najuhaKakaoUrl)
              }}
            >
              나주하 카카오채널
            </span>
            로 문의주시거나 잠시 후 다시 시도해주세요.
          </h4>
        </div> */}
      </div>
    </div>
  )
}

export default Error404
