import React, { useEffect } from 'react'
import './paymentbridgemodal.css'
import { useNavigate } from 'react-router-dom'

function Paymentbridgemodal(props) {
  let navigate = useNavigate()

  function closeModal() {
    props.closeModal()
  }

  function openNextModal() {
    props.openNextModal()
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="Paymentbridgemodal_Modal">
      <div
        className="Paymentbridgemodal_modalBody"
        onClick={e => e.stopPropagation()}>
        <h2 id="Paymentbridgemodal_modaltitle">결제를 진행 하시겠습니까?</h2>
        <h3>*결제까지 진행하셔야 신청이 완료됩니다.</h3>
        <div className="Paymentbridgemodal_buttongroup">
          <button
            className="Paymentbridgemodal_button_later"
            onClick={() => {
              navigate('/Profilepage', { state: 'UserApplicationList' })
            }}>
            나중에하기
          </button>
          <button
            className="Paymentbridgemodal_button_now"
            onClick={() => {
              closeModal()
              openNextModal()
            }}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Paymentbridgemodal
