import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { handleError } from '../utils/error'

export const getCompetitionList = async (
  startDate,
  offset,
  title,
  location
) => {
  try {
    const res = await axiosApi(
      `/competitions?startDate=${startDate}&offset=${offset}&title=${title}&location=${location}`,
      'GET'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getCompetitionDetail = async id => {
  try {
    const res = await axiosApi(`/competitions/${id}`, 'GET')
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getCompetitionPricePredict = async (id, data) => {
  try {
    const res = await axiosApiWithToken(
      `/competitions/${id}/prices`,
      'POST',
      data
    )
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getPartnershipCompetitionList = async () => {
  try {
    const res = await axiosApi(`/competitionsPartnershipTrue`, 'GET')
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getCompetitionApplicationList = async competitionId => {
  try {
    const res = await axiosApiWithToken(
      `/competitions/${competitionId}/applications`,
      'get'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}

export const getCompetitionBrackets = async competitionId => {
  try {
    const res = await axiosApiWithToken(
      `/competitions/${competitionId}/brackets`,
      'get'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}

export const postCompetitionViewCnt = async competitionId => {
  try {
    const res = await axiosApiWithToken(
      `/competitions/${competitionId}/viewCnt`,
      'post'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}


export const postCompetitionListViewCnt = async () => {
  try {
    const res = await axiosApiWithToken(
      `/competitions/viewCnt`,
      'post'
    )
    return res
  } catch (e) {
    handleError(e)
  }
}