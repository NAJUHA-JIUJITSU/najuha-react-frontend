import React from 'react'
import { useState, useEffect } from 'react'
import './profileTap.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'

function ProfileTap(props) {
  const [username, setUsername] = useState('')
  let competitionApplications = props.competitionApplications
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')

  let navigate = useNavigate()

  //User 프로필 정보 가져오기
  async function getUsers() {
    axios
      .get(`${process.env.REACT_APP_BACK_END_API}/users`, {
        headers: {
          'x-access-token': xAccessToken,
        },
      })
      .then(res => {
        setUsername(res.data.result.UserInfo.fullName)
        console.log(res.data.message)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response.status)
        console.log(err.response.data.message)
      })
    return
  }

  //실시간 대회 수 그리기
  function renderCompetitonNowCount() {
    let nowCnt = 0
    competitionApplications.map(application => {
      let competitionDate = new Date(application.Competition.doreOpen)
      let today = new Date()
      if (today <= competitionDate) {
        nowCnt++
      }
    })
    return <p className="ProfileTap_competitionCount-box-num">{nowCnt}</p>
  }

  //총 대회 수 그리기
  function renderCompetitonTotalCount() {
    let totalCnt = competitionApplications.length
    return <p className="ProfileTap_competitionCount-box-num">{totalCnt}</p>
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <section className="ProfileTap_wrapper" id="ProfilesectionTap_wrapper">
      <div className="ProfileTap_welcome">
        <div className="ProfileTap_welcome-center">
          <p>
            <span className="ProfileTap_welcome-center-username">
              {username}
            </span>
            님<br></br>
            안녕하세요
          </p>
          {/* <div className='ProfileTap_welcome-center-btn'>
                    <p>내 프로필 관리<img src='Assets/arrow_right.svg' alt='오른쪽 화살표'></img></p>
                </div> */}
        </div>
      </div>
      <div className="ProfileTap_competitionCount">
        <div className="ProfileTap_competitionCount-box nowCnt">
          <div className="ProfileTap_competitionCount-box-center">
            {renderCompetitonNowCount()}
            <p>실시간 대회신청</p>
          </div>
        </div>
        <div className="ProfileTap_competitionCount-box totalCnt">
          <div className="ProfileTap_competitionCount-box-center">
            {renderCompetitonTotalCount()}
            <p>총 대회신청</p>
          </div>
        </div>
      </div>
      <div className="ProfileTap_information">
        <li>
          <div
            className="ProfileTap_information-btn"
            onClick={() => {
              navigate('/Profilepage')
            }}
          >
            신청대회 목록
          </div>
          <div
            className="ProfileTap_information-btn"
            onClick={() => {
              navigate('/UserInfopage')
            }}
          >
            내 프로필
          </div>
          <div className="ProfileTap_information-btn">개인정보처리방침</div>
          <div className="ProfileTap_information-btn">이용약관</div>
          <div className="ProfileTap_information-btn">버전정보</div>
        </li>
      </div>
    </section>
  )
}

export default ProfileTap
