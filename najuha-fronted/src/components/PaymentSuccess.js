import React from 'react'
import './paymentSuccess.css'
import doneicon from '../src_assets/결제완료아이콘.svg'
import { useNavigate } from 'react-router-dom'

function PaymentSuccess() {
  const navigate = useNavigate()
  return (
    <div className="PaymentSuccess">
      <div className="PaymentSuccess-wrapper">
        <img src={doneicon} alt="결제완료아이콘" />
        <h2>결제가 정상적으로 완료되었습니다.</h2>
        <h3>
          결제내역은 <span>내 프로필{'>'} 대회신청</span> 목록에서 확인하실 수
          있습니다.
        </h3>
        <div className="PaymentSuccess-wrapper-button">
          <button
            onClick={() => {
              navigate('/competition')
            }}>
            이전 화면으로
          </button>
          <button
            id="PaymentSuccess-blue-button"
            onClick={() => {
              navigate('/Profilepage')
            }}>
            대회신청 목록보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
