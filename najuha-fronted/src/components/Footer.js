import React from 'react'
import './footer.css'

function footer() {
  return (
    <div className="Footer-wrap">
      <div className="footer-wrapper">
        <div className="company-wrapper">
          <h3>나주하</h3>
          <p>대표: 조지훈</p>
          <p>주소: 경기도 김포시 김포대로 831, 502호- 13실</p>
          <p>사업자등록번호: 324-08-02370</p>
          <p>통신판매업 신고번호: 2023-경기김포-1021</p>
          <p>유선번호: 010-8073-4524</p>
        </div>
        <div className="company-menu">
          <ul className="company-menu-list">
            <li>사업자정보확인</li>
            <li
              onClick={() => {
                window.location.href = 'https://najuha.com/privacypolicy'
              }}
            >
              개인정보처리방침
            </li>
            <li
              onClick={() => {
                window.location.href = 'https://najuha.com/termsofuse'
              }}
            >
              이용약관
            </li>
            <li>고객센터</li>
            <li id="company-menu-list-last">인재영입</li>
          </ul>
        </div>
      </div>
      <div className="footer-info">
        <p>
          (주)나주하는 통신판매중개자로서 통신판매의 당사자가 아닙니다. 따라서,
          등록된 대회, 거래정보 및 거래에 대햐아 (주)나주하는 어떠한 책임도 지지
          않습니다.
        </p>
        <p>Copyright c najuha Corp. All rights reserved.</p>
      </div>
    </div>
  )
}

export default footer
