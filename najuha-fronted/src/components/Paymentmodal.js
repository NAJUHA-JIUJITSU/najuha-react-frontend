import React, { useEffect, useState } from 'react'
import './Paymentmodal.css'
import { useNavigate } from 'react-router-dom'
import { tossPay } from '../apis/utils/toss'
import blackX from '../src_assets/blackX.svg'

function Paymentmodal(props) {
  const [paymentmethod, setPaymentmethod] = useState(null)
  const [easypaymethod, setEasypaymethod] = useState(null)
  let [lastCheck, setLastCheck] = useState(false)
  let navigate = useNavigate()

  function closeModal() {
    props.closeModal()
  }

  function checkPaymentOption() {
    if (!lastCheck || paymentmethod === null) {
      return false
    }

    if (paymentmethod === '간편결제' && easypaymethod === null) {
      return false
    }

    return true
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  function easypaymentUI() {
    const easyPayMethods = [
      { value: '토스페이', label: '토스페이' },
      { value: '카카오페이', label: '카카오페이' },
      { value: '삼성페이', label: '삼성페이' },
      { value: '네이버페이', label: '네이버페이' },
      // { value: '페이코', label: '페이코' },
      // { value: '엘페이', label: '엘페이' },
      // { value: 'LG페이', label: 'LG페이' },
      // { value: 'SSG페이', label: 'SSG페이' },
    ]

    return (
      <div className="Paymentmodal_secondsection_esaypaymethods">
        {easyPayMethods.map(method => (
          <div
            className="Paymentmodal_secondsection_esaypaymethod"
            key={method.value}
          >
            <input
              type="radio"
              value={method.value}
              checked={easypaymethod === method.value}
              onChange={e => setEasypaymethod(e.target.value)}
            />
            <p>{method.label}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="Paymentmodal_Modal">
      <div
        className="Paymentmodal_modalBody"
        onClick={e => e.stopPropagation()}
      >
        <div className="Paymentmodal_modaltitle">
          <h2 id="Paymentmodal_modaltitle">결제방식 선택 </h2>
          <button
            id="Paymentmodal_modalCloseBtn"
            onClick={() => {
              navigate('/Profilepage', { state: 'UserApplicationList' })
            }}
          >
            <img
              src={blackX}
              alt="삭제 아이콘"
              style={{
                width: '24px',
                marginRight: '-10px',
                marginTop: '-30px',
              }}
            ></img>
          </button>
        </div>

        <div className="Paymentmodal_firstsection">
          <h3 className="Paymentmodal_firstsection_title">결제 금액</h3>
          <div className="Paymentmodal_firstsection_infos">
            <div className="Paymentmodal_firstsection_info">
              <h4>총 대회금액</h4>
              <p>{props.normalprice}원</p>
            </div>

            <div className="Paymentmodal_firstsection_info">
              <h4>할인금액</h4>
              <p>(-){props.normalprice - props.discountedprice}원</p>
            </div>
          </div>
          <div className="Paymentmodal_firstsection_totalprice">
            <p>총 결제금액</p>
            <p style={{ color: '#4e82e5' }}>{props.discountedprice}원</p>
          </div>
        </div>
        <div className="Paymentmodal_secondsection">
          <h3 className="Paymentmodal_secondsection_title">결제 방식</h3>
          <div className="Paymentmodal_secondsection_methods">
            <div className="Paymentmodal_secondsection_method">
              <input
                type="radio"
                value="간편결제"
                checked={paymentmethod == '간편결제'}
                onChange={e => setPaymentmethod(e.target.value)}
              ></input>
              <p>간편결제</p>
            </div>
            {paymentmethod == '간편결제' ? easypaymentUI() : ''}
            <div className="Paymentmodal_secondsection_method">
              <input
                type="radio"
                value="카드"
                checked={paymentmethod == '카드'}
                onChange={e => setPaymentmethod(e.target.value)}
              ></input>
              <p>카드결제</p>
            </div>
            <div className="Paymentmodal_secondsection_method">
              <input
                type="radio"
                value="계좌이체"
                checked={paymentmethod == '계좌이체'}
                onChange={e => setPaymentmethod(e.target.value)}
              ></input>
              <p>계좌이체</p>
            </div>
          </div>
        </div>
        <div className="Paymentmodal_thirdsection">
          <div className="Paymentmodal_thirdsection_lastcheck">
            <input
              type="radio"
              checked={lastCheck === true}
              onChange={() => setLastCheck(pre => !pre)}
            ></input>
            <p>
              주문내용 확인 및 결제 동의<span> (필수)</span>
            </p>
          </div>
          <p className="Paymentmodal_thirdsection_lastinfo">
            나주하는 통신판매중개자이며 통신판매의 당사자가 아닙니다. <br />{' '}
            대회 신청, 환불의 의무와 책임은 각 판매업체에 있습니다
          </p>
          <button
            className="Paymentmodal_thirdsection_paybutton"
            onClick={() => {
              if (checkPaymentOption())
                tossPay(
                  props.competitionApplicationId,
                  paymentmethod,
                  easypaymethod
                )
              else alert('옵션을 선택해주세요')
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Paymentmodal
