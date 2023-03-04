import { axiosApi, axiosApiWithToken } from '../utils/axios'

export const patchuser = async data => {
  try {
    const res = await axiosApiWithToken('/users', 'patch', data)
    return res
  } catch (e) {
    console.log(e)
  }
}
