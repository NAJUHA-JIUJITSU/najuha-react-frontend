import React from 'react'
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

  return (
    <div className="Paymentbridgemodal_Modal">
      <div
        className="Paymentbridgemodal_modalBody"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="Paymentbridgemodal_modaltitle">결제를 진행 하시겠습니까?</h2>
        <div className="Paymentbridgemodal_buttongroup">
          <button
            className="Paymentbridgemodal_button_later"
            onClick={() => {
              navigate('/Profilepage', { state: 'UserApplicationList' })
            }}
          >
            나중에하기
          </button>
          <button
            className="Paymentbridgemodal_button_now"
            onClick={() => {
              closeModal()
              openNextModal()
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Paymentbridgemodal
