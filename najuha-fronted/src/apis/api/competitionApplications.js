import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { handleError } from '../utils/error'

export const postCompetitionApplication = async data => {
  try {
    const res = await axiosApiWithToken(
      `/competitionApplications`,
      'post',
      data
    )
    return res
  } catch (e) {
    alert('대회 신청에 실패하였습니다.')
    handleError(e)
  }
}

export const postCompetitionApplicationGroup = async data => {
  try {
    const res = await axiosApiWithToken(
      `/competitionApplicationsGroup`,
      'post',
      data
    )
    return res
  } catch (e) {
    alert('대회 신청에 실패하였습니다.')
    handleError(e)
  }
}

export const postCompetitionApplicationPayment =
  async competitionApplicationId => {
    try {
      const res = await axiosApiWithToken(
        `/competitionApplications/${competitionApplicationId}/payments`,
        'post'
      )
      return res
    } catch (e) {
      alert('결제에 실패하였습니다.')
      handleError(e)
    }
  }
