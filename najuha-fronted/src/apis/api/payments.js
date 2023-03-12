import { axiosApi } from '../utils/axios'

export const tossPaymentApproval = async (paymentKey, amount, orderId) => {
  try {
    const res = await axiosApi(
      `/payments/approval?paymentKey=${paymentKey}&amount=${amount}&orderId=${orderId}`,
      'post'
    )
    return res
  } catch (e) {
    throw e
  }
}
