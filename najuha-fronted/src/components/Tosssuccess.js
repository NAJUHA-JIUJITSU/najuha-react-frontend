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
      const res = await tossPaymentApproval(paymentKey, amount, orderId)
      if (res?.status === 200) {
        window.alert(
          `결제가 완료되었습니다. 결제 금액: ${res.data.result.totalAmount}`
        )
        navigate('/payment/success')
      }
    }
    PaymentApproval()
  }, [])
}

export default TossSuccess
