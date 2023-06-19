import { axiosApiWithToken } from '../utils/axios'

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

// 6.4 대회신청전체목록 조회
export const getAdminCompetitionApplicationList = async (
  competitionId,
  paymentFilter
) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${competitionId}/competitionApplications?paymentFilter=${paymentFilter}`,
      'get'
    )
    return res
  } catch (e) {
    console.log(e)
  }
}

// 6.5 대회 포스터 이미지 업로드, 수정
export const postAdminCompetitionPoster = async (id, data) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${id}/posters`,
      'post',
      data
    )
    alert('대회포스터가 등록되었습니다.')
    return res
  } catch (e) {
    console.log(e)
    alert('대회포스터 등록이 실패하였습니다.')
  }
}

// 6.6 대회 신청 목록 csv 형식 반환
export const getAdminCompetitionApplicationListCsv = async (
  competitionId,
  paymentFilter
) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${competitionId}/competitionApplications/csv/${paymentFilter}`,
      'get'
    )
    return res
  } catch (e) {
    console.log(e)
  }
}

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

// 6.8 대회상세 조회
export const getAdminCompetition = async id => {
  try {
    const res = await axiosApiWithToken(`/admin/competitions/${id}`, 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}

// 6.9 대회상태변경
export const patchAdminCompetitionStatus = async (id, data) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${id}/status/${data}`,
      'patch'
    )
    alert(`id :${id}대회가 ${data} 되었습니다.`)
    return res
  } catch (e) {
    alert(`id :${id}대회가 ${data} 되었습니다.`)
  }
}

// 6.10 결제취소
export const deleteAdminApplicationPayment = async id => {
  try {
    const res = await axiosApiWithToken(`/admin/payments/${id}`, 'delete')
    alert(`id :${id}결제가 취소되었습니다.`)
    return res
  } catch (e) {
    alert(`id :${id}결제가 취소되었습니다.`)
  }
}

// 6.12 대회 삭제
export const deleteAdminCompetition = async id => {
  try {
    const res = await axiosApiWithToken(`/admin/competitions/${id}`, 'delete')
    alert(`id :${id}대회가 삭제되었습니다.`)
    return res
  } catch (e) {
    alert(`id :${id}대회가 삭제되었습니다.`)
  }
}

// 6.13 유저 대회신청 상세정보 수정
export const patchAdminCompetitionApplicationInfo = async (id, data) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitionApplicationInfos/${id}`,
      'patch',
      data
    )
    alert(`id :${id}대회신청이 수정되었습니다.`)
    return res
  } catch (e) {
    console.log(e)
    alert(`id :${id}대회신청수정이 실패했습니다.\n${e.response.data.result}`)
    throw e
  }
}

// 6.14 유저 대회신청 결제상태 수정
export const patchAdminCompetitionApplicationPaymentStatus = async (
  id,
  isPayment
) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitionApplications/${id}/isPayment/${isPayment}`,
      'patch'
    )
    alert(`id :${id}대회신청 결제상태가 수정되었습니다.`)
    return res
  } catch (e) {
    console.log(e)
    alert(
      `id :${id}대회신청 결제상태 수정이 실패했습니다.\n${e.response.data.result}`
    )
    throw e
  }
}

// 6.16 대회 포스터 이미지 업로드, 수정
export const postAdminCompetitionBracket = async (id, data) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${id}/brackets`,
      'post',
      data
    )
    alert('대회대진표가 등록되었습니다.')
    return res
  } catch (e) {
    console.log(e)
    alert('대회대진표 등록이 실패하였습니다.')
  }
}

// 6.17 대회 리스트 조회수 조회
export const getAdminCompetitionListViewCnt = async () => {
  try {
    const res = await axiosApiWithToken(`/admin/competitionListViewCnt`, 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}

// 6.18 회원수 조회
export const getAdminUserCnt = async () => {
  try {
    const res = await axiosApiWithToken(`/admin/userCnt`, 'get')
    return res
  } catch (e) {
    console.log(e)
  }
}

// 6.19 대회에 해당하는 결제 오류 일괄수정
export const postAdminFixCompetitionPayments = async id => {
  try {
    const res = await axiosApiWithToken(
      `/admin/competitions/${id}/payments`,
      'post'
    )
    return res
  } catch (e) {
    console.log(e)
  }
}

// 6.20 유저 조회
export const getAdminUserList = async (offset, name, level) => {
  try {
    const res = await axiosApiWithToken(
      `/admin/users?offset=${offset}&name=${name}&level=${level}`,
      'get'
    )
    return res
  } catch (e) {}
}

// 6.21 유저 레벨 수정
export const patchAdminUserLevel = async (userId, data) => {
  try {
    const res = await axiosApiWithToken(`/admin/users/${userId}`, 'patch', data)
    return res
  } catch (e) {}
}
