import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './HostCompetition.css'
import sampleposter from '../../src_assets/samplePoster.png'
import copy from '../../src_assets/copy.png'
import dayjs from 'dayjs'
import { getCompetitionDetail } from '../../apis/api/competition'
import { getHostCompetitionApplicationListCsv } from '../../apis/api/host'
import { Cookies } from 'react-cookie'
import jwt_decode from 'jwt-decode'

function HostCompetition() {
  const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토'])
  const [inDate, setInDate] = useState(false)
  const [isApplicantTableOpen, setIsApplicantTableOpen] = useState(false)
  const [isBracketOpen, setIsBracketOpen] = useState(false)
  const [competition, setCompetition] = useState(null)
  const [viewCompetition, setViewCompetition] = useState({
    id: null,
    title: null,
    location: null,
    doreOpen: null,
    doreOpenDay: null,
    earlyBirdDeadline: null,
    earlyBirdDeadlineDay: null,
    registrationDeadline: null,
    registrationDeadlineDay: null,
    applicantTableOpenDate: null,
    applicantTableOpenDateDay: null,
    tournamentTableOpenDate: null,
    tournamentTableOpenDateDay: null,
  })
  const { id } = useParams()
  const navigate = useNavigate()
  let todaytime = dayjs()
  const [userId, setUserId] = useState('')

  const [decodedToken, setDecodedToken] = useState('')
  const nowTime = new Date()
  let tokenTime = new Date(0)

  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')
  const restApiKey = process.env.REACT_APP_REST_API_KEY
  const redirectUri = process.env.REACT_APP_REDIRECT_URI
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`

  // 텍스트 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(viewCompetition.location)
      alert('대회장소가 클립보드에 복사되었습니다!')
    } catch (error) {
      console.error('Failed to copy: ', error)
      const textarea = document.createElement('textarea')
      textarea.value = viewCompetition.location
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('대회장소가 클립보드에 복사되었습니다!')
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
      id: competition.id,
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

  function bracketOpenCheck(tournamentTableOpenDate) {
    let opendate = dayjs(tournamentTableOpenDate, 'YYYY-MM-DD')
    let openDiff = todaytime.diff(opendate, 'm')
    if (openDiff >= 0) {
      setIsBracketOpen(true)
    }
  }

  function downloadCsv(data, filename) {
    let csvData = new Blob([data], { type: 'text/csv' })
    let csvUrl = URL.createObjectURL(csvData)
    let tempLink = document.createElement('a')

    tempLink.href = csvUrl
    tempLink.setAttribute('download', filename)
    tempLink.click()
  }

  const convertHeaderToKorean = csvData => {
    console.log(csvData)
    const csvDataArray = csvData.split('\n')
    const headers = csvDataArray[0].split(',')
    const newHeaders = headers.map(header => {
      switch (header) {
        case 'division':
          return '디비전'
        case 'playerName':
          return '이름'
        case 'playerBirth':
          return '생년월일'
        case 'phoneNumber':
          return '전화번호'
        case 'uniform':
          return '유니폼'
        case 'gender':
          return '성별'
        case 'divisionName':
          return '디비전명'
        case 'belt':
          return '벨트'
        case 'weight':
          return '체급'
        case 'team':
          return '소속팀'
        case 'isPayment':
          return '결제여부'
        case 'amount':
          return '결제금액'
        case 'normal':
          return '일반금액'
        case 'earlyBird':
          return '얼리버드할인'
        case 'withGi':
          return '노기할인'
        case 'withOther':
          return '앱솔할인'
        case 'orderId':
          return '주문번호'
        case 'paymentId':
          return '결제ID'
        default:
          return header
      }
    })

    csvDataArray[0] = newHeaders.join(',')
    return csvDataArray.join('\n')
  }

  async function handleCsvDownload() {
    const [res1, res2] = await Promise.all([
      getHostCompetitionApplicationListCsv(id, 'unpaid'),
      getHostCompetitionApplicationListCsv(id, 'paid'),
    ])

    if (res1?.status === 200 && res1.data.result.csv) {
      const csv1 = convertHeaderToKorean(res1.data.result.csv)
      downloadCsv(csv1, `미결제_${viewCompetition.title}_참가자명단.csv`)
    }

    if (res2?.status === 200 && res2.data.result.csv) {
      const csv2 = convertHeaderToKorean(res2.data.result.csv)
      downloadCsv(csv2, `결제완료_${viewCompetition.title}_참가자명단.csv`)
    }
  }

  useEffect(() => {
    getCompetition(id)
  }, [])

  // 유저 아이디, 레벨 확인하기
  useEffect(() => {
    let decodedToken
    if (xAccessToken) {
      // 토큰 확인하기
      decodedToken = jwt_decode(xAccessToken)
    }
    // 로그인한 상태
    if (decodedToken) {
      setUserId(decodedToken.userId)
      setDecodedToken(decodedToken)
    }
  }, [])

  useEffect(() => {
    if (competition !== null) {
      competitionParsing(competition)
      dateCheck(competition.registrationDate, competition.registrationDeadline)
      applicantTableOpenCheck(competition.applicantTableOpenDate)
      bracketOpenCheck(competition.tournamentTableOpenDate)
    }
  }, [competition])

  return (
    <div className="competition-wrapper">
      <div className="competition-top">
        <div className="competition-top-title">
          <h2>{viewCompetition.title}</h2>
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
                {viewCompetition.doreOpen} ({viewCompetition.doreOpenDay})
              </p>
            </div>
            <div className="competition-top-content-info-each">
              <h3>대회 장소</h3>
              <div className="competition-top-content-copyWrap">
                <p>{viewCompetition ? viewCompetition.location : ''}</p>
                <div
                  className="competition-top-content-copy"
                  onClick={copyToClipboard}
                >
                  <img
                    src={copy}
                    alt="복사하기"
                    className="competition-top-content-copyIcon"
                  ></img>
                  <span>복사</span>
                </div>
              </div>
            </div>
            <div className="competition-top-content-info-each">
              <h3>얼리버드 마감</h3>
              <p>
                {viewCompetition.earlyBirdDeadline !== null
                  ? viewCompetition.earlyBirdDeadline.slice(0, 2) === '98'
                    ? '해당없음'
                    : `${viewCompetition.earlyBirdDeadline} (${viewCompetition.earlyBirdDeadlineDay})`
                  : ''}
              </p>
            </div>
            <div className="competition-top-content-info-each">
              <h3>참가신청 마감</h3>
              <p>
                {viewCompetition.registrationDeadline !== null
                  ? viewCompetition.registrationDeadline.slice(0, 2) === '30'
                    ? '해당없음'
                    : `${viewCompetition.registrationDeadline} (${viewCompetition.registrationDeadlineDay})`
                  : ''}
              </p>
            </div>
            <div className="competition-top-content-info-each">
              <h3>참가자 공개</h3>
              <p>
                {viewCompetition.applicantTableOpenDate !== null
                  ? viewCompetition.applicantTableOpenDate.slice(0, 2) === '30'
                    ? '해당없음'
                    : `${viewCompetition.applicantTableOpenDate} (${viewCompetition.applicantTableOpenDateDay})`
                  : ''}
              </p>
            </div>
            <div
              id="competition-top-content-info-each-last"
              className="competition-top-content-info-each"
            >
              <h3>대진표 공개</h3>
              <p>
                {viewCompetition.tournamentTableOpenDate !== null
                  ? viewCompetition.tournamentTableOpenDate.slice(0, 2) === '98'
                    ? '해당없음'
                    : `${viewCompetition.tournamentTableOpenDate} (${viewCompetition.tournamentTableOpenDateDay})`
                  : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="competition-top-buttons">
          <button id="competition-top-button1" onClick={handleCsvDownload}>
            다운로드
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostCompetition
