import { axiosApi, axiosApiWithToken } from '../utils/axios'

export const postCompetitionApplication = async data => {
  try {
    const res = await axiosApiWithToken(
      `/competitionApplications`,
      'post',
      data
    )
    return res
  } catch (e) {
    console.log(e)
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
    console.log(e)
  }
}
