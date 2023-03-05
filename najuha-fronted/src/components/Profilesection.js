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
import {
  getUserInfo,
  getUserApplicationCompetitionList,
} from '../apis/api/user'

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
    let res = await getUserInfo()
    setUserInfo(res.data.result.UserInfo)
  }

  //User 신청 대회목록 가져오기
  async function getCompetitionApplication() {
    let res = await getUserApplicationCompetitionList()
    setCompetitionApplications(res.data.result)
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
