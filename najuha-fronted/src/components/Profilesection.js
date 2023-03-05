import React from 'react'
import { useState, useEffect } from 'react'
import './profilesection.css'
import axios from 'axios'
import ProfileTap from '../components/ProfileTap'
import UserApplicationList from './UserApplicationList'
import { Cookies } from 'react-cookie'
import { useLocation } from 'react-router-dom'
import UserInfo from './UserInfo'
import jwt_decode from 'jwt-decode'
import { getuser } from '../apis/api/user'

function Profilesection() {
  const [userInfo, setUserInfo] = useState([])
  const [componentSelected, setComponentSelected] = useState('UserInfo')
  const [competitionApplications, setCompetitionApplications] = useState([]) //유저 신청 대회 가져오기
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')
  let decodedToken = null
  if (xAccessToken) {
    decodedToken = jwt_decode(xAccessToken)
  }
  const userLevel = decodedToken?.userLevel
  const paramComponentSelected = useLocation().state

  //User 프로필 정보 가져오기
  async function getUsers() {
    let res = await getuser()
    setUserInfo(res.data.result.UserInfo)
  }

  //User 대회 정보 가져오기
  async function getCompetitionApplication() {
    axios
      .get(
        `${process.env.REACT_APP_BACK_END_API}/users/competitionApplications`,
        {
          headers: {
            'x-access-token': xAccessToken,
          },
        }
      )
      .then(res => {
        setCompetitionApplications(res.data.result)
        console.log(res.data.message)
      })
      .catch(err => {
        // console.log(err)
        // console.log(err.response.status)
        // console.log(err.response.data.message)
      })
    return
  }
  useEffect(() => {
    if (xAccessToken) {
      if (userLevel > 1) {
        getCompetitionApplication()
        getUsers()
      }
    }
  }, [userLevel])

  useEffect(() => {
    if (paramComponentSelected !== null)
      setComponentSelected(paramComponentSelected)
  }, [paramComponentSelected])

  function selectedComponentRender() {
    if (componentSelected === 'UserApplicationList') {
      return (
        <UserApplicationList
          competitionApplications={competitionApplications}
          getCompetitionApplication={getCompetitionApplication}
          userLevel={userLevel}
          xAccessToken={xAccessToken}
          cookies={cookies}
        />
      )
    } else if (
      componentSelected === 'UserInfo' ||
      componentSelected === 'UserInfoToggle'
    ) {
      return (
        <UserInfo
          xAccessToken={xAccessToken}
          cookies={cookies}
          setUserInfo={setUserInfo}
          getUsers={getUsers}
          userInfo={userInfo}
          componentSelected={componentSelected}
          userLevel={userLevel}
        />
      )
    }
  }

  return (
    <div className="Profilesection_wrapper">
      <ProfileTap
        competitionApplications={competitionApplications}
        userName={userInfo.fullName}
        disapper={componentSelected === 'UserInfoToggle' ? false : true}
      />
      {selectedComponentRender()}
    </div>
  )
}

export default Profilesection
