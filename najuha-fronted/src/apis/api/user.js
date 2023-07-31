import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { handleError } from '../utils/error'

//2.1 유저프로필수정
export const patchUserInfo = async data => {
  try {
    const res = await axiosApiWithToken('/users', 'patch', data)
    return res
  } catch (e) {
    alert('유저 정보 수정에 실패하였습니다.')
    handleError(e)
  }
}

//2.2 유저프로필조회
export const getUserInfo = async () => {
  try {
    const res = await axiosApiWithToken('/users', 'get')
    return res
  } catch (e) {
    handleError(e)
  }
}

//2.3 유저대회신청리스트조회
export const getUserApplicationCompetitionList = async () => {
  try {
    const res = await axiosApiWithToken('/users/competitionApplications', 'get')
    return res
  } catch (e) {
    handleError(e)
  }
}

//2.4 유저대회신청상세조회
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

//2.6 유저대회신청삭제
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

//2.7 유저대회신청수정
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

//2.8 유저결제환불
export const deleteUserPayment = async (orderId, applicationInfoIds) => {
  try {
    const res = await axiosApiWithToken(
      `/users/payments/${orderId}`,
      'delete',
      { applicationInfoIds }
    )
    return res
  } catch (e) {
    alert('환불에 실패하였습니다.')
    // handleError(e)
    console.log(e)
  }
}

//2.10 유저결제내역조회(영수증)
export const getUserPaymentReceipt = async orderId => {
  try {
    const res = await axiosApiWithToken(`/users/payments/${orderId}`, 'get')
    return res
  } catch (e) {
    // handleError(e)
    console.log(e)
  }
}
