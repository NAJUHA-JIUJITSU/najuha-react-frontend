import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'
import { kakaoLogin } from '../apis/api/auth'
import jwt_decode from 'jwt-decode'

// import jwt from 'jsonwebtoken';
const KakaoLogin = () => {
  const cookies = new Cookies()
  let navigate = useNavigate()

  useEffect(() => {
    let params = new URL(document.location.toString()).searchParams
    let code = params.get('code')
    let body = {
      code: code,
    }

    async function TryLoginUser() {
      let res = await kakaoLogin(body)
      console.log(res)
      if (res?.status === 200) {
        let xAccessToken = res.data.result.xAccessToken
        const decodeToken = jwt_decode(xAccessToken)

        if (decodeToken.userLevel === 1) {
          alert('프로필 수정까지 마치시면 회원가입이 완료됩니다.')
          navigate('/profilepage', { state: 'UserInfo' })
        } else {
          alert('로그인에 성공하셨습니다')
          navigate('/')
        }
      }
    }

    let checkxAccessToken = cookies.get('x-access-token')
    if (checkxAccessToken) {
      alert('이미 로그인이 되어있습니다')
      navigate('/')
    }
    TryLoginUser()
  }, [])

  // 회원가입후 프로필 기입이 필수이기 때문에 프로필 수정 유도
  // 프로필 수정까지 마치고 다른기능 사용 가능
  // return
}

export default KakaoLogin
