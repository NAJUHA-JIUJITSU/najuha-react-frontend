import { loadTossPayments } from '@tosspayments/payment-sdk'
import { postCompetitionApplicationPayment } from '../api/competitionApplications'

export const tossPay = async (
  competitionApplicationId,
  paymentmethod,
  easypaymethod
) => {
  const frontBaseUrl = process.env.REACT_APP_FRONT_END_API
  const clientkey = process.env.REACT_APP_TOSS_CLIENTKEY
  const res = await postCompetitionApplicationPayment(competitionApplicationId)
  if (res?.status !== 200) return
  const data = res.data.result
  if (paymentmethod == '카드') {
    loadTossPayments(clientkey).then(tossPayments => {
      tossPayments.requestPayment('카드', {
        amount: data.amount,
        orderId: data.orderId,
        orderName: data.orderName,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        successUrl: frontBaseUrl + '/toss/success',
        failUrl: frontBaseUrl + '/toss/fail',
      })
    })
  } else if (paymentmethod == '간편결제') {
    loadTossPayments(clientkey).then(tossPayments => {
      tossPayments.requestPayment('카드', {
        amount: data.amount,
        orderId: data.orderId,
        orderName: data.orderName,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        successUrl: frontBaseUrl + '/toss/success',
        failUrl: frontBaseUrl + '/toss/fail',
        flowMode: 'DIRECT',
        easyPay: easypaymethod,
      })
    })
  } else if (paymentmethod == '계좌이체') {
    loadTossPayments(clientkey).then(tossPayments => {
      tossPayments.requestPayment('계좌이체', {
        amount: data.amount,
        orderId: data.orderId,
        orderName: data.orderName,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        successUrl: frontBaseUrl + '/toss/success',
        failUrl: frontBaseUrl + '/toss/fail',
      })
    })
  }
}
