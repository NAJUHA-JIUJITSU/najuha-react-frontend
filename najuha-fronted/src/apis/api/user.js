import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { handleError } from '../utils/error'

export const patchUserInfo = async data => {
  try {
    const res = await axiosApiWithToken('/users', 'patch', data)
    return res
  } catch (e) {
    alert('유저 정보 수정에 실패하였습니다.')
    handleError(e)
  }
}

export const getUserInfo = async () => {
  try {
    const res = await axiosApiWithToken('/users', 'get')
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getUserApplicationCompetitionList = async () => {
  try {
    const res = await axiosApiWithToken('/users/competitionApplications', 'get')
    return res
  } catch (e) {
    handleError(e)
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
    handleError(e)
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
    alert('대회 삭제에 실패하였습니다.')
    handleError(e)
  }
}

export const patchUserApplicationCompetition = async (
  applicationId,
  competitionApplicationList
) => {
  try {
    const res = await axiosApiWithToken(
      `/users/competitionApplications/${applicationId}`,
      'patch',
      { competitionApplicationList }
    )
    return res
  } catch (e) {
    alert('대회 수정에 실패하였습니다.')
    handleError(e)
  }
}
