import { axiosApi, axiosApiWithToken } from '../utils/axios'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { handleError } from '../utils/error'
const cookies = new Cookies()

export const kakaoLogin = async code => {
  console.log(code)
  try {
    const res = await axiosApi('/auth/kakao', 'POST', code)
    cookies.set('x-access-token', res.data.result.xAccessToken, {
      path: '/',
      overwrite: true,
    })
    return res
  } catch (e) {
    alert('로그인에 실패하였습니다')
    handleError(e)
  }
}
