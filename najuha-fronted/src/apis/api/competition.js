import { axiosApi, axiosApiWithToken } from '../utils/axios'

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
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getCompetitionDetail = async id => {
  try {
    const res = await axiosApi(`/competitions/${id}`, 'GET')
    return res
  } catch (e) {
    console.log(e)
  }
}

export const getCompetitionPricePredict = async id => {
  try {
    const res = await axiosApi(`/competitions/${id}/price`, 'GET')
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
  }
}
