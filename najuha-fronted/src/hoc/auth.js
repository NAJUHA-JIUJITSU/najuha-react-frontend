import React from 'react'
import { useEffect } from 'react'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const cookies = new Cookies()
    const xAccessToken = cookies.get('x-access-token')
    const restApiKey = process.env.REACT_APP_REST_API_KEY
    const redirectUri = process.env.REACT_APP_REDIRECT_URI
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`
    let navigate = useNavigate()

    useEffect(() => {
      let decodedToken
      if (xAccessToken) {
        // 토큰 확인하기
        decodedToken = jwt_decode(xAccessToken)
      }

      if (!decodedToken) {
        // 로그인하지 않은 상태
        if (option === true) {
          alert('로그인이 필요합니다')
          window.location.href = kakaoAuthURL
        }
      } else {
        //로그인한상태
        if (adminRoute && decodedToken.userLevel !== 5) {
          // 유저레벨 다시 5로 바꿔야함.
          alert('접근 권한이 없습니다.')
          navigate('/')
        } else {
          if (option === false) {
            // 로그인하면 못들어가는 페이지(ex. 로그인 리다이렉트 페이지 등) but 작동이안됨. if문에 걸려도 해당 컴포넌트를 리턴함. 다음컴포넌트에서 리다이렉트가 실행되는 컴포넌트는 리다이렉트를 막을 수가 없는 것으로 보임
            alert('로그인하면 들어오지 못합니다.')
            navigate('/')
          }
        }
      }
      // dispatch(Auth(xAccessToken)).then(res => {
      //   console.log(res)
      //   //로그인하지 않은 상태
      //   if (!res.payload.isSuccess) {
      //     if (option === true) {
      //       alert('로그인이 필요합니다.')
      //       navigate('/redirect', { state: { url: `${kakaoAuthURL}` } })
      //     }
      //   } else {
      //     //로그인 한 상태
      //     if (adminRoute && res.payload.result.userLevel !== 2) {
      //       // 유저레벨 다시 5로 바꿔야함.
      //       navigate('/')
      //     } else {
      //       if (option === false) {
      //         // 로그인하면 못들어가는 페이지(ex. 로그인 리다이렉트 페이지 등) but 작동이안됨. if문에 걸려도 해당 컴포넌트를 리턴함. 다음컴포넌트에서 리다이렉트가 실행되는 컴포넌트는 리다이렉트를 막을 수가 없는 것으로 보임
      //         navigate('/')
      //       }
      //     }
      //   }
      // })
    }, [])

    return <SpecificComponent />
  }

  return AuthenticationCheck
}
