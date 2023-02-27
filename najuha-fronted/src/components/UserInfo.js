import React from 'react'
import { useState, useEffect } from 'react'
import './userInfo.css'
import axios from 'axios'
import './profilesectionToggle.css'

const beltEngtoKor = {
  black: '블랙',
  brown: '브라운',
  purple: '퍼플',
  blue: '블루',
  white: '화이트',
}
const genderEngtoKor = {
  female: '여자',
  male: '남자',
}

function Read({ userInfo, setMode }) {
  return (
    <div className="UserInfo_Boxs UserInfo_boxsRead">
      <div className="UserInfo_infoBox">
        <span>이름</span>
        <p>{userInfo?.fullName}</p>
      </div>
      <div className="UserInfo_infoBox">
        <span>성별</span>
        <p>{genderEngtoKor[userInfo?.gender]}</p>
      </div>
      <div className="UserInfo_infoBox">
        <span>휴대폰</span>
        <p>{userInfo?.phoneNumber}</p>
      </div>
      <div className="UserInfo_infoBox">
        <span>이메일</span>
        <p>{userInfo?.email}</p>
      </div>
      <div className="UserInfo_infoBox">
        <span>벨트</span>
        <p>{beltEngtoKor[userInfo?.belt]}</p>
      </div>
      <div className="UserInfo_infoBox">
        <span>체급</span>
        <p>{userInfo?.weight}kg</p>
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

function Update({ userInfo, setUserInfo, setMode, updateUser }) {
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
    let newuserInfo = { ...userInfo }
    newuserInfo[title] = e.target.value
    console.log(newuserInfo)
    setUserInfo(newuserInfo)
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
            placeholder={userInfo?.fullName}
            value={userInfo?.fullName}
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
              value="male"
              id="male"
              checked={genderEngtoKor[userInfo?.gender] === '남자'}
              onChange={e => handleChange(e, 'gender')}
            />
            <span>남자</span>
          </p>
          <p>
            <input
              type="radio"
              name="female"
              value="female"
              id="female"
              checked={genderEngtoKor[userInfo?.gender] === '여자'}
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
              placeholder={userInfo?.phoneNumber}
              value={userInfo?.phoneNumber}
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
            placeholder={userInfo?.email}
            value={userInfo?.email}
            onChange={e => handleChange(e, 'email')}
            required
          />
        </p>
      </div>
      <div className="UserInfo_infoBox">
        <span>벨트</span>
        <div className="UserInfo_beltSeclet">
          <select
            value={userInfo?.belt}
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
              placeholder={userInfo?.weight}
              value={userInfo?.weight}
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

function UserInfo(props) {
  const [mode, setMode] = useState('READ')
  const [userInfo, setUserInfo] = useState(props.userInfo)
  const [switchClassName, setSwitchClassName] = useState('UserInfo')
  const componentSelected = props.componentSelected
  const cookies = props.cookies
  const xAccessToken = props.xAccessToken
  const userLevel = props.userLevel

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
        if (props.userLevel === 1) {
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

  useEffect(() => {
    if (userLevel === 1) {
      setMode('UPDATE')
    }
  }, [userLevel])

  useEffect(() => {
    setUserInfo(props.userInfo)
  }, [props.userInfo])

  useEffect(() => {
    if (componentSelected === 'UserInfoToggle')
      setSwitchClassName('ProfilesectionToggle')
    else setSwitchClassName('UserInfo')
  }, [componentSelected])

  return (
    <>
      <div className={`${switchClassName}_right`}>
        <h2>내 프로필</h2>
        {mode === 'READ' ? (
          <Read userInfo={userInfo} setMode={setMode} />
        ) : (
          <Update
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setMode={setMode}
            updateUser={updateUser}
          />
        )}
      </div>
    </>
  )
}

export default UserInfo
