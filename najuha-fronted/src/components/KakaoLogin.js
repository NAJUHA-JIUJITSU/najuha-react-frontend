import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { LoginUser } from '../_action/user_action'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

// import jwt from 'jsonwebtoken';
const KakaoLogin = () => {
  const cookies = new Cookies()
  const dispatch = useDispatch()
  const endPoint = process.env.REACT_APP_BACK_END_API + '/auth/kakao'
  let navigate = useNavigate()
  // let userLevel = useSelector((user) => user);

  async function LoginUser(url, dataTosubmit) {
    try {
      let ret = await axios.post(url, {
        code: dataTosubmit.code,
      })
      cookies.set('x-access-token', ret.data.result.xAccessToken, {
        path: '/',
        overwrite: true,
      })
      console.log(ret)
      return ret.data.result.xAccessToken
    } catch (err) {
      throw err
    }
  }

  // let ret = await axios
  //   .post(url, {
  //     code: dataTosubmit.code,
  //   })
  //   .then(res => {
  //     cookies.set('x-access-token', res.data.result.xAccessToken, {
  //       path: '/',
  //       overwrite: true,
  //     })
  //     alert('로그인에 성공하셨습니다.')
  //     return res.data.xAccessToken
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     alert('로그인에 실패하셨습니다.')
  //     return err.response
  //   })
  // return ret

  useEffect(() => {
    let params = new URL(document.location.toString()).searchParams
    let code = params.get('code')
    let body = {
      code: code,
    }

    async function TryLoginUser() {
      try {
        let xAccessToken = await LoginUser(endPoint, body)
        const decodeToken = jwt_decode(xAccessToken)

        if (decodeToken.userLevel === 1) {
          alert('프로필 수정까지 마치시면 회원가입이 완료됩니다.')
          navigate('/profilepage', { state: 'UserInfo' })
        } else {
          alert('로그인에 성공하셨습니다')
          navigate('/')
        }
      } catch (err) {
        alert(`에러가 발생 ${err.message} \n 로그인에 실패하였습니다`)
        navigate('/')
      }
    }

    let checkxAccessToken = cookies.get('x-access-token')
    if (checkxAccessToken) {
      alert('이미 로그인이 되어있습니다')
      navigate('/')
    }
    TryLoginUser()

    // .then(res => {
    //   console.log(res)
    // })
    // .catch(err => {
    //   console.log(err)
    // })
    // dispatch(LoginUser(endPoint, body))
    //   .then(res => {
    //     console.log(res.payload)
    //     if (res.payload.isSuccess && res.payload.result.userLevel === 1)
    //       navigate('/UserInfopage')
    //     else navigate('/')

    //     return
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     navigate('/')
    //   })
  }, [])

  // 회원가입후 프로필 기입이 필수이기 때문에 프로필 수정 유도
  // 프로필 수정까지 마치고 다른기능 사용 가능
  // return
}

export default KakaoLogin
