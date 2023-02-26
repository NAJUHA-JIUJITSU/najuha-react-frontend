import React from 'react'
import { useState, useEffect } from 'react'
import './profilesection.css'
import axios from 'axios'
import ProfileTap from '../components/ProfileTap'
import UserApplicationList from './UserApplicationList'
import { Cookies } from 'react-cookie'
import { useLocation } from 'react-router-dom'
import UserInfo from './UserInfo'

function Profilesection() {
  const [userInfo, setUserInfo] = useState([])
  const [componentSelected, setComponentSelected] = useState(
    'UserApplicationList'
  )
  const [competitionApplications, setCompetitionApplications] = useState([]) //유저 신청 대회 가져오기
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')
  const paramComponentSelected = useLocation().state

  //User 프로필 정보 가져오기
  async function getUsers() {
    axios
      .get(`${process.env.REACT_APP_BACK_END_API}/users`, {
        headers: {
          'x-access-token': cookies.get('x-access-token'),
        },
      })
      .then(res => {
        setUserInfo(res.data.result.UserInfo)
        console.log(res.data.message)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response.status)
        console.log(err.response.data.message)
      })
    return
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
        console.log(err)
        console.log(err.response.status)
        console.log(err.response.data.message)
      })
    return
  }
  useEffect(() => {
    getCompetitionApplication()
    getUsers()
  }, [])

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
