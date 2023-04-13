import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { handleError } from '../utils/error'

export const postLike = async id => {
  try {
    const res = await axiosApiWithToken(`/likes/competitions/${id}`, 'post')
    return res
  } catch (e) {
    handleError(e)
  }
}
