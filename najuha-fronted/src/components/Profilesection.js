import React from 'react'
import { useState, useEffect } from 'react'
import './profilesection.css'
import axios from 'axios'
import ProfileTap from '../components/ProfileTap'
import UserApplicationList from './UserApplicationList'
import { Cookies } from 'react-cookie'

function Profilesection() {
  const [competitionApplications, setCompetitionApplications] = useState([]) //유저 신청 대회 가져오기
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')

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
  }, [])

  return (
    <div className="Profilesection_wrapper">
      <ProfileTap competitionApplications={competitionApplications} />
      <UserApplicationList
        competitionApplications={competitionApplications}
        getCompetitionApplication={getCompetitionApplication}
      />
    </div>
  )
}

export default Profilesection
