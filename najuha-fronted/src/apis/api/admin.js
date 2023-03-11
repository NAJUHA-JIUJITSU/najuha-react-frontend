import { axiosApiWithToken } from '../utils/axios'

export const postCompetition = async (data, option) => {
  try {
    const res = await axiosApiWithToken('/admin/competitions', 'post', data)
    alert(`${option}대회가 등록되었습니다.`)
    return res
  } catch (e) {
    console.log(e)
    alert(`${option}대회등록이 실패하였습니다.`)
  }
}

export const patchCompetition = async (id, data) => {
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
