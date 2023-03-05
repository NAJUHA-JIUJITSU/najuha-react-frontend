import { axiosApi, axiosApiWithToken } from '../utils/axios'

export const patchuser = async data => {
  try {
    const res = await axiosApiWithToken('/users', 'patch', data)
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getuser = async () => {
  try {
    const res = await axiosApiWithToken('/users', 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getuserapplication = async () => {
  try {
    const res = await axiosApiWithToken('/users/competitionApplications', 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}
