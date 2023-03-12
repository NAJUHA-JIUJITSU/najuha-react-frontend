import React from 'react'
import './paymentFail.css'
import Failicon from '../src_assets/결제실패아이콘.svg'
import { useNavigate } from 'react-router-dom'

function PaymentFail() {
  const navigate = useNavigate()
  return (
    <div className="PaymentFail">
      <div className="PaymentFail-wrapper">
        <img src={Failicon} alt="결제완료아이콘" />
        <h2>결제가 정상적으로 진행되지 않았습니다.</h2>
        <h3>
          해당 대회신청은<span>내 프로필 {'>'} 대회신청</span> 목록에서 확인하실
          수 있습니다.
        </h3>
        <div className="PaymentFail-wrapper-button">
          <button
            onClick={() => {
              navigate('/')
            }}>
            홈으로
          </button>
          <button
            id="PaymentFail-blue-button"
            onClick={() => {
              navigate('/Profilepage', { state: 'UserApplicationList' })
            }}>
            대회신청 목록
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFail
