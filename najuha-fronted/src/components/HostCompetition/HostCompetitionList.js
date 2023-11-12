import React from 'react'
import { useState, useEffect } from 'react'
import './HostCompetitionList.css'
import { useNavigate } from 'react-router-dom'
import samplePoster from '../../src_assets/samplePoster.png'

function HostCompetitionList(props) {
  const navigate = useNavigate()
  const userLevel = props.userLevel
  const hostCompetitions = props.hostCompetitions

  const s3EndPoint = process.env.REACT_APP_S3_END_POINT

  //요일 값 구하기
  function getDayOfWeek(날짜문자열) {
    //ex) getDayOfWeek('2022-06-13')

    const week = ['일', '월', '화', '수', '목', '금', '토']

    const dayOfWeek = week[new Date(날짜문자열).getDay()]

    return dayOfWeek
  }

  //실시간 대회 렌더
  function renderCompetition() {
    return hostCompetitions.map(competition => {
      return (
        <div key={competition.id}>
          <div
            onClick={() => {
              navigate(`/HostCompetition/${competition.id}`)
            }}
          >
            <div className="HostCompetitionList_competitoninfo"></div>
            <div className="HostCompetitionList_competitonbox">
              <div className="HostCompetitionList_boxLeft">
                <img
                  src={
                    `${s3EndPoint}/${competition.CompetitionPoster.imageKey}` ||
                    samplePoster
                  }
                  alt="대회포스터"
                ></img>
                <p className="HostCompetitionList_posterBlack"></p>
                <h3>
                  {competition.doreOpen.substr(5, 5).replace('-', '.')}
                  <span>({getDayOfWeek(competition.doreOpen)})</span>
                </h3>
              </div>
              <div className="HostCompetitionList_boxRight">
                <div className={'HostCompetitionList_deleteNone'}></div>
                <div className="HostCompetitionList_boxRightTitle">
                  <h3>{competition.title}</h3>
                  <p>{competition.location}</p>
                </div>
              </div>
            </div>
            <div className="HostCompetitionList_boxRightCost"></div>
          </div>

          <hr className="HostCompetitionList_competitonHr" />
        </div>
      )
    })
  }

  useEffect(() => {
    if (userLevel == 1) {
      alert('회원가입을 완료해주세요')
      navigate('/profilepage', { state: 'UserInfo' })
    }
  }, [userLevel])

  return (
    <>
      <section className="HostCompetitionList_right">
        <div className="HostCompetitionList_competitonList">
          {renderCompetition()}
        </div>
      </section>
    </>
  )
}

export default HostCompetitionList
