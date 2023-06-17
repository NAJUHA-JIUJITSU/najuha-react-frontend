import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { handleError } from '../utils/error'

export const getHostCompetitionApplicationList = async competitionId => {
  try {
    const res = await axiosApiWithToken(
      `/host/competitions/${competitionId}/applications`,
      'get'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getHostCompetitionApplicationListCsv = async (
  competitionId,
  paymentFilter
) => {
  try {
    const res = await axiosApiWithToken(
      `/host/competitions/${competitionId}/applications/csv?paymentFilter=${paymentFilter}`,
      'get'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}
