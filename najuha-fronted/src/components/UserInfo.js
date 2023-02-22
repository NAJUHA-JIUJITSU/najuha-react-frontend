import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './userInfo.css'
import axios from 'axios'
import { useJwt } from 'react-jwt'

function UserInfo(props) {
  const beltEngtoKor = {
    black: '블랙',
    brown: '브라운',
    purple: '퍼플',
    blue: '블루',
    white: '화이트',
  }
  const [mode, setMode] = useState('READ')
  const userInfo = props.userInfo
  let user = userParsing(userInfo)
  let content = null
  const cookies = props.cookies
  const xAccessToken = props.xAccessToken
  const { decodedToken, isExpired } = useJwt(xAccessToken)

  async function updateUser(updateUerinfo) {
    console.log(updateUerinfo)
    axios({
      method: 'patch',
      headers: {
        'x-access-token': xAccessToken,
      },
      url: `${process.env.REACT_APP_BACK_END_API}/users`,
      data: updateUerinfo,
    })
      .then(res => {
        if (decodedToken.userLevel === 1) {
          alert('회원가입이 완료되었습니다')
        }
        cookies.set('x-access-token', res.data.result, {
          path: '/',
          overwrite: true,
        })
        console.log(res.data.message)
        props.getUsers()
      })
      .catch(err => {
        console.log(err)
        console.log(err.response.data.message)
      })
  }

  function userParsing(userInfo) {
    let fullName = userInfo.fullName
    let email = userInfo.email
    let phoneNumber = userInfo.phoneNumber
    let gender = userInfo.gender === 'female' ? '여자' : '남자'
    let weight = userInfo.weight
    let belt = userInfo.belt
    return {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender,
      belt: belt,
      weight: weight,
    }
  }

  function Read() {
    return (
      <div className="UserInfo_Boxs UserInfo_boxsRead">
        <div className="UserInfo_infoBox">
          <span>이름</span>
          <p>{user?.fullName}</p>
        </div>
        <div className="UserInfo_infoBox">
          <span>성별</span>
          <p>{user?.gender}</p>
        </div>
        <div className="UserInfo_infoBox">
          <span>휴대폰</span>
          <p>{user?.phoneNumber}</p>
        </div>
        <div className="UserInfo_infoBox">
          <span>이메일</span>
          <p>{user?.email}</p>
        </div>
        <div className="UserInfo_infoBox">
          <span>벨트</span>
          <p>{beltEngtoKor[user?.belt]}</p>
        </div>
        <div className="UserInfo_infoBox">
          <span>체급</span>
          <p>{user?.weight}kg</p>
        </div>
        <button
          className="UserInfo_updateBtn"
          onClick={e => {
            e.preventDefault()
            setMode('UPDATE')
          }}
        >
          수정하기
        </button>
      </div>
    )
  }

  function Update() {
    const handleChange = (e, title) => {
      if (title == 'phoneNumber' || title == 'weight') {
        e.target.value = e.target.value.replace(/[^0-9]/g, '')
        if (title == 'phoneNumber' && e.target.value.length > 11) {
          e.target.value = e.target.value.slice(0, 11)
        }
        if (title == 'weight' && e.target.value.length > 3) {
          e.target.value = e.target.value.slice(0, 3)
        }
      }
      let newuser = { ...user }
      newuser[title] = e.target.value
      props.setUserInfo(newuser)
    }

    const onSumbit = e => {
      e.preventDefault()
      let updateUerinfo = {
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        phoneNumber: e.target.phoneNumber.value,
        gender: e.target.male.checked ? 'male' : 'female',
        belt: e.target.belt.value,
        weight: e.target.weight.value,
      }
      updateUser(updateUerinfo)
      setMode('READ')
    }

    return (
      <form onSubmit={e => onSumbit(e)}>
        <div className="UserInfo_infoBox">
          <span>이름</span>
          <p>
            <input
              type="text"
              name="fullName"
              placeholder={user?.fullName}
              value={user?.fullName}
              onChange={e => handleChange(e, 'fullName')}
              required
            />
          </p>
        </div>
        <div className="UserInfo_infoBox">
          <span>성별</span>
          <div className="UserInfo_genderCategory">
            <p>
              <input
                type="radio"
                name="male"
                value="남자"
                id="male"
                checked={user?.gender === '남자'}
                onChange={e => handleChange(e, 'gender')}
              />
              <span>남자</span>
            </p>
            <p>
              <input
                type="radio"
                name="female"
                value="여자"
                id="female"
                checked={user?.gender === '여자'}
                onChange={e => handleChange(e, 'gender')}
              />
              <span>여자</span>
            </p>
          </div>
        </div>
        <div className="UserInfo_infoBox">
          <span>휴대폰</span>
          <div className="UserInfo_flexbox UserInfo_phoneNumber">
            <p>
              <input
                type="tel"
                name="phoneNumber"
                placeholder={user?.phoneNumber}
                value={user?.phoneNumber}
                onChange={e => handleChange(e, 'phoneNumber')}
                required
              />
            </p>
            <span>'-' 없이 숫자만 입력(12자리)</span>
          </div>
        </div>
        <div className="UserInfo_infoBox">
          <span>이메일</span>
          <p>
            <input
              type="email"
              name="email"
              placeholder={user?.email}
              value={user?.email}
              onChange={e => handleChange(e, 'email')}
              required
            />
          </p>
        </div>
        <div className="UserInfo_infoBox">
          <span>벨트</span>
          <div className="UserInfo_beltSeclet">
            <select
              value={user?.belt}
              name="belt"
              onChange={e => handleChange(e, 'belt')}
            >
              <option value="white">화이트</option>
              <option value="blue">블루</option>
              <option value="purple">퍼플</option>
              <option value="brown">브라운</option>
              <option value="black">블랙</option>
            </select>
          </div>
        </div>
        <div className="UserInfo_infoBox">
          <span>체급</span>
          <div className="UserInfo_flexbox">
            <p>
              <input
                type="number"
                name="weight"
                min="0"
                max="200"
                placeholder={user?.weight}
                value={user?.weight}
                onChange={e => handleChange(e, 'weight')}
              />
            </p>
            <span>숫자만 입력</span>
          </div>
        </div>
        <button className="UserInfo_updateBtn" type="submit">
          저장하기
        </button>
      </form>
    )
  }

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.userLevel === 1) {
        setMode('UPDATE')
      }
    }
  }, [decodedToken])

  if (mode === 'READ') {
    content = <Read />
  } else if (mode === 'UPDATE') {
    content = <Update />
  }

  return (
    <>
      <div className="UserInfo_right">
        <h2>내 프로필</h2>
        {content}
      </div>
    </>
  )
}

export default UserInfo
