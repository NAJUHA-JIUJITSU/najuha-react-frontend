import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './competition.css'
import sampleposter from '../src_assets/samplePoster.png'
import copy from '../src_assets/copy.png'
import dayjs from 'dayjs'
import { getCompetitionDetail } from '../apis/api/competition'
import MarkdownEditor from './MarkdownEditor'

function Competition() {
  const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토'])
  const [inDate, setInDate] = useState(false)
  const [isApplicantTableOpen, setIsApplicantTableOpen] = useState(false)
  const [competition, setCompetition] = useState(null)
  const [viewCompetition, setViewCompetition] = useState(false)
  const { id } = useParams()
  const [markdown, setMarkdown] = useState('')
  const navigate = useNavigate()
  let todaytime = dayjs()

  // 텍스트 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(viewCompetition.location)
      alert('대회장소가 클립보드에 복사되었습니다!')
    } catch (error) {
      console.error('Failed to copy: ', error)
    }
  }

  const getCompetition = async id => {
    const res = await getCompetitionDetail(id)
    if (res?.status === 200) {
      const newCompetition = res.data.result
      setCompetition(newCompetition)
    }
  }
  function competitionParsing(competition) {
    let doreOpen = competition.doreOpen
      .substr(2, 8)
      .replace('-', '.')
      .replace('-', '.')
    let doreOpenDay = week[new Date(competition.doreOpen).getDay()]
    let location = competition.location
    let earlyBirdDeadline = competition.earlyBirdDeadline
      .substr(2, 8)
      .replace('-', '.')
      .replace('-', '.')
    let earlyBirdDeadlineDay =
      week[new Date(competition.earlyBirdDeadline).getDay()]
    let registrationDeadline = competition.registrationDeadline
      .substr(2, 8)
      .replace('-', '.')
      .replace('-', '.')
    let registrationDeadlineDay =
      week[new Date(competition.registrationDeadline).getDay()]
    let applicantTableOpenDate = competition.applicantTableOpenDate
      .substr(2, 8)
      .replace('-', '.')
      .replace('-', '.')
    let applicantTableOpenDateDay =
      week[new Date(competition.applicantTableOpenDate).getDay()]
    let tournamentTableOpenDate = competition.tournamentTableOpenDate
      .substr(2, 8)
      .replace('-', '.')
      .replace('-', '.')
    let tournamentTableOpenDateDay =
      week[new Date(competition.tournamentTableOpenDate).getDay()]
    setViewCompetition({
      title: competition.title,
      location: location,
      doreOpen: doreOpen,
      doreOpenDay: doreOpenDay,
      earlyBirdDeadline: earlyBirdDeadline,
      earlyBirdDeadlineDay: earlyBirdDeadlineDay,
      registrationDeadline: registrationDeadline,
      registrationDeadlineDay: registrationDeadlineDay,
      applicantTableOpenDate: applicantTableOpenDate,
      applicantTableOpenDateDay: applicantTableOpenDateDay,
      tournamentTableOpenDate: tournamentTableOpenDate,
      tournamentTableOpenDateDay: tournamentTableOpenDateDay,
    })
  }

  function dateCheck(registrationDate, registrationDeadline) {
    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
    let deadlineDiff = todaytime.diff(finishdate, 'm')
    if (deadlineDiff > 0) {
      // 마감날짜(데드라인)이 지났을경우
      return false
    }
    let openDiff = todaytime.diff(opendate, 'm')

    if (openDiff < 0) {
      // 현재날짜가 오픈 전일 경우 ex) 신청오픈 D-20
      return false
    }
    setInDate(true)
  }

  function applicantTableOpenCheck(applicantTableOpenDate) {
    let opendate = dayjs(applicantTableOpenDate, 'YYYY-MM-DD')
    let openDiff = todaytime.diff(opendate, 'm')
    if (openDiff >= 0) {
      setIsApplicantTableOpen(true)
    }
  }

  useEffect(() => {
    getCompetition(id)
  }, [])

  useEffect(() => {
    if (competition !== null) {
      competitionParsing(competition)
      dateCheck(competition.registrationDate, competition.registrationDeadline)
      applicantTableOpenCheck(competition.applicantTableOpenDate)
      setMarkdown(competition.information)
    }
  }, [competition])

  return (
    <div className="competition-wrapper">
      <div className="competition-top">
        <div className="competition-top-title">
          <h2>{viewCompetition ? viewCompetition.title : ''}</h2>
        </div>
        <div className="competition-top-content">
          {/* <div className='competition-top-content-img'></div> */}
          <img
            className="competition-top-content-img"
            src={
              competition
                ? competition.CompetitionPoster
                  ? competition.CompetitionPoster.imageUrl
                  : sampleposter
                : ''
            }
            alt="대회이미지"
          />
          <div className="competition-top-content-info">
            <div className="competition-top-content-info-each">
              <h3>대회 날짜</h3>
              <p>
                {viewCompetition ? viewCompetition.doreOpen : ''} (
                {viewCompetition ? viewCompetition.doreOpenDay : ''})
              </p>
            </div>
            <div className="competition-top-content-info-each">
              <h3>대회 장소</h3>
              <div className="competition-top-content-copyWrap">
                <p>{viewCompetition ? viewCompetition.location : ''}</p>
                <div
                  className="competition-top-content-copy"
                  onClick={copyToClipboard}>
                  <img
                    src={copy}
                    alt="복사하기"
                    className="competition-top-content-copyIcon"></img>
                  <span>복사</span>
                </div>
              </div>
            </div>
            <div className="competition-top-content-info-each">
              <h3>얼리버드 마감</h3>
              <p>
                {viewCompetition ? viewCompetition.earlyBirdDeadline : ''} (
                {viewCompetition ? viewCompetition.earlyBirdDeadlineDay : ''})
              </p>
            </div>
            <div className="competition-top-content-info-each">
              <h3>참가신청 마감</h3>
              <p>
                {viewCompetition ? viewCompetition.registrationDeadline : ''} (
                {viewCompetition ? viewCompetition.registrationDeadlineDay : ''}
                )
              </p>
            </div>
            <div className="competition-top-content-info-each">
              <h3>참가자 공개</h3>
              <p>
                {viewCompetition ? viewCompetition.applicantTableOpenDate : ''}{' '}
                (
                {viewCompetition
                  ? viewCompetition.applicantTableOpenDateDay
                  : ''}
                )
              </p>
            </div>
            <div
              id="competition-top-content-info-each-last"
              className="competition-top-content-info-each">
              <h3>대진표 공개</h3>
              <p>
                {viewCompetition ? viewCompetition.tournamentTableOpenDate : ''}{' '}
                (
                {viewCompetition
                  ? viewCompetition.tournamentTableOpenDateDay
                  : ''}
                )
              </p>
            </div>
          </div>
        </div>
        <div className="competition-top-buttons">
          {isApplicantTableOpen && competition.isPartnership === true ? (
            <button
              id="competition-top-button2"
              onClick={() => {
                navigate(`/competition/${competition.id}/applicant`)
              }}>
              참가자 명단
            </button>
          ) : (
            ''
          )}
          {inDate ? (
            competition.isPartnership === true ? (
              <button
                id="competition-top-button1"
                onClick={() => {
                  navigate(`/competition/applymethod/${competition.id}`)
                }}>
                대회 신청
              </button>
            ) : (
              <button
                id="competition-top-button1"
                onClick={() => {
                  window.location.href = competition.nonPartnershipPageLink
                }}>
                대회 신청
              </button>
            )
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="competition-bottom">
        <MarkdownEditor data={markdown} mode="view" />
      </div>
    </div>
  )
}

export default Competition
