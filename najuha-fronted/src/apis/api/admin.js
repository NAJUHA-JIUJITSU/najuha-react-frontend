import { axiosApiWithToken } from '../utils/axios'

//6.7 대회리스트 조회
export const getAdminCompetitionList = async (
  startDate,
  offset,
  title,
  location
) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions?startDate=${startDate}&offset=${offset}&title=${title}&location=${location}`,
      'get'
    )
    return res
  } catch (e) {
    console.log(e)
  }
}

// 6.2 대회등록
export const postAdminCompetition = async (data, option) => {
  try {
    const res = await axiosApiWithToken('/admin/competitions', 'post', data)
    alert(`${option}대회가 등록되었습니다.`)
    return res
  } catch (e) {
    console.log(e)
    alert(`${option}대회등록이 실패하였습니다.`)
  }
}

// 6.3 대회수정
export const patchAdminCompetition = async (id, data) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${id}`,
      'patch',
      data
    )
    alert('대회가 수정되었습니다.')
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
    alert('대회수정이 실패하였습니다.')
  }
}

// export const getCompetitionA
