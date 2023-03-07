import { axiosApi, axiosApiWithToken } from '../utils/axios'

export const patchUserInfo = async data => {
  try {
    const res = await axiosApiWithToken('/users', 'patch', data)
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getUserInfo = async () => {
  try {
    const res = await axiosApiWithToken('/users', 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getUserApplicationCompetitionList = async () => {
  try {
    const res = await axiosApiWithToken('/users/competitionApplications', 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getUserApplicationCompetitionInfo = async applicationId => {
  try {
    const res = await axiosApiWithToken(
      `/users/competitionApplications/${applicationId}`,
      'get'
    )
    return res
  } catch (e) {
    console.log(e)
  }
}

export const deleteUserApplicationCompetition = async applicationId => {
  try {
    const res = await axiosApiWithToken(
      `/users/competitionApplications/${applicationId}`,
      'delete'
    )
    return res
  } catch (e) {
    console.log(e)
  }
}
