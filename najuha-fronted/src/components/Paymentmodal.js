import React from 'react'
import './Paymentmodal.css';
import { useNavigate } from 'react-router-dom'

function Paymentmodal(props) {
    let navigate = useNavigate();

    function closeModal() {
        props.closeModal();
    }

    function easypaymentUI() {
        return (
            <div className='Paymentmodal_secondsection_esaypaymethods'>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='토스페이' checked={props.easypaymethod == '토스페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>토스페이</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='카카오페이' checked={props.easypaymethod == '카카오페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>카카오페이</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='삼성페이' checked={props.easypaymethod == '삼성페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>삼성페이</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='네이버페이' checked={props.easypaymethod == '네이버페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>네이버페이</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='페이코' checked={props.easypaymethod == '페이코'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>페이코</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='엘페이' checked={props.easypaymethod == '엘페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>엘페이</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='LG페이' checked={props.easypaymethod == 'LG페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>LG페이</p>
                </div>
                <div className='Paymentmodal_secondsection_esaypaymethod'>
                    <input type='radio' value='SSG페이' checked={props.easypaymethod == 'SSG페이'} onChange={(e) => props.setEasypaymethod(e.target.value)}></input>
                    <p>SSG페이</p>
                </div>
            </div>
        )
    }

  return (
    <div className="Paymentmodal_Modal" >
            <div className="Paymentmodal_modalBody" onClick={(e) => e.stopPropagation()}>
                <h2 id="Paymentmodal_modaltitle">결제방식 선택 </h2>
                <button id="Paymentmodal_modalCloseBtn" onClick={() => navigate('/Profilepage')}>
                ✖
                </button>
                <div className='Paymentmodal_firstsection'>
                    <h3 className='Paymentmodal_firstsection_title'>결제 금액</h3>
                    <div className='Paymentmodal_firstsection_infos' >
                        <div className='Paymentmodal_firstsection_info'>
                            <h4>총 대회금액</h4>
                            <p>{props.normalprice}</p>
                        </div>
                        
                        <div className='Paymentmodal_firstsection_info'>
                            <h4>할인금액</h4>
                            <p>(-){props.normalprice - props.discountedprice}</p>
                        </div>
                    </div>
                    <div className='Paymentmodal_firstsection_totalprice'>
                        <p>총 결제금액</p>
                        <p>{props.discountedprice}</p>
                    </div>
                </div>
                <div className= 'Paymentmodal_secondsection'>
                    <h3 className='Paymentmodal_secondsection_title'>결제 방식</h3>
                    <div className='Paymentmodal_secondsection_methods'>
                        <div className='Paymentmodal_secondsection_method'>
                            <input type='radio' value='간편결제' checked={props.paymentmethod == '간편결제'} onChange={(e) => props.setPaymentmethod(e.target.value)}></input>
                            <p>간편결제</p>
                        </div>
                        {props.paymentmethod == '간편결제' ? easypaymentUI() : ''}
                        <div className='Paymentmodal_secondsection_method'>
                            <input type='radio' value='카드' checked={props.paymentmethod == '카드'} onChange={(e) => props.setPaymentmethod(e.target.value)}></input>
                            <p>카드결제</p>
                        </div>
                        <div className='Paymentmodal_secondsection_method'>
                            <input type='radio' value='계좌이체' checked={props.paymentmethod == '계좌이체'} onChange={(e) => props.setPaymentmethod(e.target.value)}></input>
                            <p>계좌이체</p>
                        </div>
                    </div>
                </div>
                <div className= 'Paymentmodal_thirdsection'>
                    <div className='Paymentmodal_thirdsection_lastcheck'>
                        <input type='radio'></input>
                        <p>주문내용 확인 및 결제 동의</p>
                    </div>
                    <p className='Paymentmodal_thirdsection_lastinfo'>나주하는 통신판매중개자이며 통신판매의 당사자가 아닙니다. <br/> 대회 신청, 환불의 의무와 책임은 각 판매업체에 있습니다</p>
                    <button className='Paymentmodal_thirdsection_paybutton' onClick={props.tossPay}>결제하기</button>
                </div>
            </div>
    </div>
  )
}

export default Paymentmodal