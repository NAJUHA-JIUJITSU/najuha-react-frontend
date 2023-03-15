import { axiosApi } from '../utils/axios'
import { handleError } from '../utils/error'

export const tossPaymentApproval = async (paymentKey, amount, orderId) => {
  try {
    const res = await axiosApi(
      `/payments/approval?paymentKey=${paymentKey}&amount=${amount}&orderId=${orderId}`,
      'post'
    )
    return res
  } catch (e) {
    window.alert('결제에 실패하였습니다.')
    window.location.href = '/payment/fail'
  }
}
