//import React from "react";
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { tossPaymentApproval } from '../apis/api/payments'

const TossSuccess = () => {
  const navigate = useNavigate()
  let orderId = new URL(window.location.href).searchParams.get('orderId')
  let paymentKey = new URL(window.location.href).searchParams.get('paymentKey')
  let amount = new URL(window.location.href).searchParams.get('amount')

  useEffect(() => {
    async function PaymentApproval() {
      try {
        const res = await tossPaymentApproval(paymentKey, amount, orderId)
        window.alert(
          `결제가 완료되었습니다. 결제 금액: ${res.data.result.totalAmount}`
        )
        navigate('/payment/success')
      } catch (e) {
        console.log(e)
        window.alert('결제에 실패하였습니다.')
        navigate('/payment/fail')
      }
    }
    PaymentApproval()
  }, [])

  //     axios
  //       .post(
  //         backBaseUrl +
  //           `/payments/approval?paymentKey=${paymentKey}&amount=${amount}&orderId=${orderId}`
  //       )
  //       .then(res => {
  //         console.log(res)
  //         window.alert(
  //           `결제가 완료되었습니다. 결제 금액: ${res.data.result.totalAmount}`
  //         )
  //         navigate('/payment/success')
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         window.alert('결제에 실패하였습니다.')
  //         navigate('/payment/fail')
  //       })
  //   })
}

export default TossSuccess
